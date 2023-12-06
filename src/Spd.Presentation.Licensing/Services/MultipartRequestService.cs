using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;
using Microsoft.Net.Http.Headers;
using Spd.Utilities.Shared.Exceptions;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Net;
using System.Reflection;
using System.Text.Json;

namespace Spd.Presentation.Licensing.Services;


public interface IMultipartRequestService
{
    //the request contains many files and one T model in Json
    Task<(T model, ICollection<UploadFileInfo> uploadFileInfoList)> UploadMultipleFilesAsync<T>(HttpRequest request, ModelStateDictionary modelState);
}

public class MultipartRequestService : IMultipartRequestService
{
    //private readonly CmsConfiguration cmsConfiguration;
    private readonly JsonOptions _jsonOptions;
    private readonly ILogger<MultipartRequestService> _logger;

    public MultipartRequestService(/*IOptions<CmsConfiguration> cmsConfiguration,*/
        IOptions<JsonOptions> jsonOptions,
        ILogger<MultipartRequestService> logger)
    {
        //this.cmsConfiguration = cmsConfiguration.Value;
        this._jsonOptions = jsonOptions.Value;
        this._logger = logger;
    }

    public async Task<(T model, ICollection<UploadFileInfo> uploadFileInfoList)> UploadMultipleFilesAsync<T>(HttpRequest request,
        ModelStateDictionary modelState)
    {
        T model;
        if (!Directory.Exists("/tmp"))
        {
            Directory.CreateDirectory("/tmp");
        }

        var defaultFormOptions = new FormOptions();

        if (!MultipartRequestHelper.IsMultipartContentType(request.ContentType))
        {
            modelState.AddModelError("File", $"Expected a multipart request, but got {request.ContentType}");
            throw new ApiException(HttpStatusCode.BadRequest, modelState.ToString());
        }

        var boundary = MultipartRequestHelper.GetBoundary(MediaTypeHeaderValue.Parse(request.ContentType), defaultFormOptions.MultipartBoundaryLengthLimit);
        var reader = new MultipartReader(boundary, request.Body);

        MultipartSection section = null;

        var formAccumulator = new KeyValueAccumulator();
        ICollection<UploadFileInfo> uploadFileInfoList = new Collection<UploadFileInfo>();
        while ((section = await reader.ReadNextSectionAsync()) != null)
        {
            var hasContentDispositionHeader = ContentDispositionHeaderValue.TryParse(section.ContentDisposition, out ContentDispositionHeaderValue contentDisposition);

            if (hasContentDispositionHeader)
            {
                if (MultipartRequestHelper.HasFileContentDisposition(contentDisposition))
                {
                    uploadFileInfoList.Add(await SaveFileAndGetFileInfoAsync(section, contentDisposition, modelState));
                }
                else if (MultipartRequestHelper.HasFormDataContentDisposition(contentDisposition))
                {
                    formAccumulator = await GetFormUrlKeyValuePairAsync(section, contentDisposition, modelState, defaultFormOptions);
                }
            }
        }

        var nameOfT = typeof(T).Name;
        // Bind form data to a model
        var formValueProvider = new FormValueProvider(
            BindingSource.Form,
            new FormCollection(formAccumulator.GetResults()),
            CultureInfo.CurrentCulture);

        // Get the json serialized value as string
        string serialized = formValueProvider.GetValue(nameOfT).FirstValue;

        if (string.IsNullOrEmpty(serialized))
            modelState.AddModelError(nameOfT, $"{nameOfT} missing or empty");

        // Deserialize json string using custom json options defined in startup, if available
        model = _jsonOptions?.JsonSerializerOptions is null ?
            JsonSerializer.Deserialize<T>(serialized) :
            JsonSerializer.Deserialize<T>(serialized, _jsonOptions.JsonSerializerOptions);

        // Run data annotation validation to validate properties and fields on deserialized model
        var validationResultProps = from property in TypeDescriptor.GetProperties(model).Cast<PropertyDescriptor>()
                                    from attribute in property.Attributes.OfType<ValidationAttribute>()
                                    where !attribute.IsValid(property.GetValue(model))
                                    select new
                                    {
                                        Member = property.Name,
                                        ErrorMessage = attribute.FormatErrorMessage(string.Empty)
                                    };

        var validationResultFields = from field in TypeDescriptor.GetReflectionType(model).GetFields().Cast<FieldInfo>()
                                     from attribute in field.GetCustomAttributes<ValidationAttribute>()
                                     where !attribute.IsValid(field.GetValue(model))
                                     select new
                                     {
                                         Member = field.Name,
                                         ErrorMessage = attribute.FormatErrorMessage(string.Empty)
                                     };

        // Add the validation results to the model state
        var errors = validationResultFields.Concat(validationResultProps);
        foreach (var validationResultItem in errors)
            modelState.AddModelError(validationResultItem.Member, validationResultItem.ErrorMessage);

        // the model must be valid
        if (!modelState.IsValid)
        {
            throw new ApiException(HttpStatusCode.BadRequest, modelState.ToString());
        }

        return (model, uploadFileInfoList);
    }

    private async Task<UploadFileInfo> SaveFileAndGetFileInfoAsync(MultipartSection section, ContentDispositionHeaderValue contentDisposition, ModelStateDictionary modelState)
    {
        var file = $"/tmp\\{Guid.NewGuid()}.temp";
        using (var stream = File.Create(file))
        {
            try
            {
                await section.Body.CopyToAsync(stream);

                // Check if the file is empty or exceeds the size limit.
                if (stream.Length == 0)
                {
                    modelState.AddModelError("File", "The file is empty.");
                }
                //else if (stream.Length > cmsConfiguration.DocumentMaxFileSizeMB * 1048576)
                //{
                //    modelState.AddModelError("File", $"The file exceeds {cmsConfiguration.DocumentMaxFileSizeMB:N1} MB.");
                //}
                //else if (!FileTools.IsValidFileExtension(contentDisposition.FileName.Value,
                //            stream, cmsConfiguration.DocumentAllowedExtentions.Split(',')))
                //{
                //    modelState.AddModelError("File", "The file type isn't permitted or the file's signature doesn't match the file's extension.");
                //}

                return new UploadFileInfo()
                {
                    FileKey = contentDisposition.Name.HasValue? contentDisposition.Name.Value: null,
                    FileName = contentDisposition.FileName.HasValue ? contentDisposition.FileName.Value : null,
                    FilePath = file,
                    FileExtension = Path.GetExtension(contentDisposition.FileName.Value).ToLowerInvariant()
                };
            }
            catch (Exception ex)
            {
                var msg = $"The upload failed. Error: {ex.HResult}";
                modelState.AddModelError("File", msg);
                _logger.LogError($"msg. {ex.Message}");
                return null;
            }
        }
    }

    /// <summary>
    /// Based on:
    /// https://docs.microsoft.com/en-us/aspnet/core/mvc/models/file-uploads?view=aspnetcore-5.0#upload-large-files-with-streaming
    /// </summary>
    private async Task<(FormValueProvider documentViewModelProvider, string filename, string fileExtension)> StreamFile(HttpRequest request,
        Stream targetStream,
        ModelStateDictionary modelState)
    {
        var defaultFormOptions = new FormOptions();

        if (!MultipartRequestHelper.IsMultipartContentType(request.ContentType))
        {
            modelState.AddModelError("File", $"Expected a multipart request, but got {request.ContentType}");
            throw new ApiException(HttpStatusCode.BadRequest, modelState.ToString());
        }

        // Used to accumulate all the form url encoded key value pairs in the
        // request.
        var formAccumulator = new KeyValueAccumulator();

        var boundary = MultipartRequestHelper.GetBoundary(
            MediaTypeHeaderValue.Parse(request.ContentType),
            defaultFormOptions.MultipartBoundaryLengthLimit);
        var reader = new MultipartReader(boundary, request.Body);

        var section = await reader.ReadNextSectionAsync();

        if (request.Body.Length <= 0)
        {
            modelState.AddModelError("Payload", $"Expected a multipart request with correct payload, but got 0 payload");
            throw new ApiException(HttpStatusCode.BadRequest, modelState.ToString());
        }

        string filename = null;
        string fileExtension = null;

        while (section != null)
        {
            var hasContentDispositionHeader = ContentDispositionHeaderValue.TryParse(section.ContentDisposition, out ContentDispositionHeaderValue contentDisposition);

            if (hasContentDispositionHeader)
            {
                if (MultipartRequestHelper.HasFileContentDisposition(contentDisposition))
                {
                    filename = await CheckStreamAndGetFilenameAsync(section, contentDisposition, targetStream, modelState);
                    fileExtension = Path.GetExtension(contentDisposition.FileName.Value).ToLowerInvariant();
                }
                else if (MultipartRequestHelper.HasFormDataContentDisposition(contentDisposition))
                {
                    formAccumulator = await GetFormUrlKeyValuePairAsync(section, contentDisposition, modelState, defaultFormOptions);
                }
            }

            // Drains any remaining section body that has not been consumed and
            // reads the headers for the next section.
            section = await reader.ReadNextSectionAsync();
        }

        // Bind form data to a model
        var formValueProvider = new FormValueProvider(
            BindingSource.Form,
            new FormCollection(formAccumulator.GetResults()),
            CultureInfo.CurrentCulture);

        return (formValueProvider, filename, fileExtension);
    }

    private async Task<string> CheckStreamAndGetFilenameAsync(MultipartSection section, ContentDispositionHeaderValue contentDisposition, Stream targetStream,
        ModelStateDictionary modelState)
    {
        try
        {
            await section.Body.CopyToAsync(targetStream);

            // Check if the file is empty or exceeds the size limit.
            if (targetStream.Length == 0)
            {
                modelState.AddModelError("File", "The file is empty.");
            }
            //else if (targetStream.Length > cmsConfiguration.DocumentMaxFileSizeMB * 1048576)
            //{
            //    modelState.AddModelError("File", $"The file exceeds {cmsConfiguration.DocumentMaxFileSizeMB:N1} MB.");
            //}
            //else if (!FileTools.IsValidFileExtension(contentDisposition.FileName.Value,
            //    targetStream, cmsConfiguration.DocumentAllowedExtentions.Split(',')))
            //{
            //    modelState.AddModelError("File",
            //        "The file type isn't permitted or the file's signature doesn't match the file's extension.");
            //}

            return contentDisposition.FileName.Value;
        }
        catch (Exception ex)
        {
            var msg = $"The upload failed. Error: {ex.HResult}";
            modelState.AddModelError("File", msg);
            _logger.LogError($"msg. {ex.Message}");
            return null;
        }
    }

    //get all the form url encoded key value pairs in the request
    private async Task<KeyValueAccumulator> GetFormUrlKeyValuePairAsync(MultipartSection section,
        ContentDispositionHeaderValue contentDisposition,
        ModelStateDictionary modelState,
        FormOptions defaultFormOptions
        )
    {
        // Used to accumulate all the form url encoded key value pairs in the
        // request.
        var formAccumulator = new KeyValueAccumulator();

        // Content-Disposition: form-data; name="key"
        //
        // value

        // Do not limit the key name length here because the
        // multipart headers length limit is already in effect.
        var key = HeaderUtilities.RemoveQuotes(contentDisposition.Name);
        var encoding = MultipartRequestHelper.GetEncoding(section);
        using var streamReader = new StreamReader(
            section.Body,
            encoding,
            detectEncodingFromByteOrderMarks: true,
            bufferSize: 1024,
            leaveOpen: true);
        // The value length limit is enforced by MultipartBodyLengthLimit
        var value = await streamReader.ReadToEndAsync();
        if (string.Equals(value, "undefined", StringComparison.OrdinalIgnoreCase))
        {
            value = string.Empty;
        }
        formAccumulator.Append(key.Value, value);

        if (formAccumulator.ValueCount > defaultFormOptions.ValueCountLimit)
        {
            modelState.AddModelError("File", $"Form key count limit {defaultFormOptions.ValueCountLimit} exceeded.");
        }
        return formAccumulator;
    }
}

