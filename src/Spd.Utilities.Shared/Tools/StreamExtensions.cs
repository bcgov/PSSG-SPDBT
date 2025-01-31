﻿namespace Spd.Utilities.Shared.Tools;

public static class StreamExtensions
{
    public static string ConvertToBase64(this Stream stream)
    {
        if (stream is MemoryStream memoryStream)
            return Convert.ToBase64String(memoryStream.ToArray());

        var bytes = new Byte[(int)stream.Length];

        stream.Seek(0, SeekOrigin.Begin);
        stream.ReadExactly(bytes);
        return Convert.ToBase64String(bytes);
    }
}