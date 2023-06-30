using System.ComponentModel;

namespace Spd.Utilities.Shared.Tools;

public static class FileNameHelper
{
    public static string? GetFileExtension(string fileName)
    {
        int dot = fileName.LastIndexOf('.');
        if (dot > 0)
        {
            return fileName.Substring(dot, fileName.Length - dot);
        }
        return null;
    }
}

