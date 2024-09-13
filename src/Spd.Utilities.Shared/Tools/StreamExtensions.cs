namespace Spd.Utilities.Shared.Tools;

public static class StreamExtensions
{
    public static string ConvertToBase64(this Stream stream)
    {
        if (stream is MemoryStream memoryStream)
            return Convert.ToBase64String(memoryStream.ToArray());

        var bytes = new Byte[(int)stream.Length];

        stream.Seek(0, SeekOrigin.Begin);
#pragma warning disable S2674 // The length returned from a stream read should be checked
        stream.Read(bytes, 0, (int)stream.Length);
#pragma warning restore S2674 // The length returned from a stream read should be checked

        return Convert.ToBase64String(bytes);
    }
}