using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Presentation.Dynamics.Helper;

public class FileStorageHelper
{
    public static Tag[] GetTagsFromStr(string? tagStr, string classification)
    {
        try
        {
            List<Tag> taglist = new() { new Tag(SpdHeaderNames.HEADER_FILE_CLASSIFICATION, classification) };

            if (!string.IsNullOrWhiteSpace(tagStr))
            {
                string[] tags = tagStr.Split(',');
                foreach (string tag in tags)
                {
                    string[] strs = tag.Split('=');
                    if (strs.Length != 2) throw new OutOfRangeException(HttpStatusCode.BadRequest, $"Invalid {SpdHeaderNames.HEADER_FILE_TAG} string");
                    taglist.Add(
                        new Tag(strs[0], strs[1])
                    );
                }
            }
            return taglist.ToArray();
        }
        catch
        {
            throw new ApiException(HttpStatusCode.BadRequest, $"Invalid {SpdHeaderNames.HEADER_FILE_TAG} string");
        }
    }

    public static string GetStrFromTags(IEnumerable<Tag> tags)
    {
        List<string> tagStrlist = new();
        foreach (Tag t in tags)
        {
            if (t.Key != SpdHeaderNames.HEADER_FILE_CLASSIFICATION)
                tagStrlist.Add($"{t.Key}={t.Value}");
        }
        return string.Join(",", tagStrlist);
    }
}
