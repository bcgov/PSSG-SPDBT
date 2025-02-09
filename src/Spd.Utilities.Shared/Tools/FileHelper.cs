﻿namespace Spd.Utilities.Shared.Tools;

public static class FileHelper
{
    public static string? GetFileExtension(string fileName)
    {
        int dot = fileName.LastIndexOf('.');
        if (dot > 0)
        {
            return fileName.Substring(dot);
        }
        return null;
    }

    public static string? GetFileExtensionWithoutDot(string fileExtension)
    {
        if (fileExtension == null) return null;
        return fileExtension.Replace(".", string.Empty);
    }
}

