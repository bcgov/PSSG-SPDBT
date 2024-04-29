using System.Net.Mime;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;

namespace Spd.Utilities.Printing.BCMailPlus;

internal sealed class BcMailPlusApi : IBcMailPlusApi
{
    private static readonly HttpClient httpClient = new HttpClient();
    private readonly string baseUri;

    public BcMailPlusApi(IOptions<BCMailPlusSettings> options)
    {
        var settings = options.Value;
        this.baseUri = $"{settings.ServerUrl}/auth={settings.User};{settings.Secret}/JSON";
    }

    public async Task<JobStatus> CreateJob(string jobClass, JsonDocument payload, CancellationToken ct)
    {
        using var content = new StringContent(payload.RootElement.ToString(), Encoding.UTF8, MediaTypeNames.Application.Json);
        var uri = new Uri($"{this.baseUri}/create:{jobClass}");
        var response = await httpClient.PostAsync(uri, content, ct);
        response.EnsureSuccessStatusCode();

        try
        {
            var jobStatusResponse = await JsonSerializer.DeserializeAsync<JobStatus>(await response.Content.ReadAsStreamAsync(ct), cancellationToken: ct);
            if (jobStatusResponse?.JobId == null) throw new InvalidOperationException($"Error creating job {jobClass}");
            return jobStatusResponse!;
        }
        catch (JsonException e)
        {
            var responseAsString = await response.Content.ReadAsStringAsync(ct);
            throw new InvalidOperationException($"Error parsing BCMailPlus response: {responseAsString}", e);
        }
    }

    public async Task<byte[]?> GetAsset(string jobId, string asset, CancellationToken ct)
    {
        using var content = new StringContent(JsonSerializer.Serialize(new { job = jobId, asset }), Encoding.UTF8, MediaTypeNames.Application.Json);

        var uri = new Uri($"{this.baseUri}/asset");
        var response = await httpClient.PostAsync(uri, content, ct);
        response.EnsureSuccessStatusCode();

        return await response.Content.ReadAsByteArrayAsync(ct);
    }

    public async Task<JobStatusResponse> GetJobStatus(IEnumerable<string> jobs, CancellationToken ct)
    {
        using var content = new StringContent(JsonSerializer.Serialize(new { jobs }), Encoding.UTF8, MediaTypeNames.Application.Json);
        var uri = new Uri($"{this.baseUri}/status");
        var response = await httpClient.PostAsync(uri, content, ct);
        response.EnsureSuccessStatusCode();

        try
        {
            var jobStatusResponse = await JsonSerializer.DeserializeAsync<JobStatusResponse>(await response.Content.ReadAsStreamAsync(ct), cancellationToken: ct);
            return jobStatusResponse!;
        }
        catch (JsonException e)
        {
            var responseAsString = await response.Content.ReadAsStringAsync(ct);
            throw new InvalidOperationException($"Error parsing BCMailPlus response: {responseAsString}", e);
        }
    }
}