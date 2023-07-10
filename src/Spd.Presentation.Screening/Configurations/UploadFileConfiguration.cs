namespace Spd.Presentation.Screening.Configurations;

public class UploadFileConfiguration
{
    public string StreamFileFolder { get; set; }
    public int MaxFileSizeMB { get; set; }
    public string AllowedExtentions { get; set; }
    public int MaxAllowedFileNumbers { get; set; }
}
