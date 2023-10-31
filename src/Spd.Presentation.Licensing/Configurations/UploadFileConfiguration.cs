namespace Spd.Presentation.Licensing.Configurations;

public class UploadFileConfiguration
{
    public string StreamFileFolder { get; set; }
    public int MaxFileSizeMB { get; set; }
    public string AllowedExtensions { get; set; }
    public int MaxAllowedNumberOfFiles { get; set; }
}