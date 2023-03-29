using System.ComponentModel.DataAnnotations;

namespace Spd.Presentation.Dynamics.Models
{
    public class UploadFileRequest
    {
        [Required(ErrorMessage = "Please enter file name")]
        public string EntityName { get; set; }

        [Required(ErrorMessage = "Please enter Entity Guid")]
        public Guid EntityId { get; set; }

        [Required(ErrorMessage = "Please enter file name")]
        public string FileName { get; set; }

        [Required(ErrorMessage = "Please specify file content type")]
        public string ContentType { get; set; }

        public string Classification { get; set; }
        public string Tag1 { get; set; }
        public string Tag2 { get; set; }
        public string Tag3 { get; set; }

        [Required(ErrorMessage = "Please select file")]
        public IFormFile File { get; set; }
    }

    public class UploadFileRequestJson
    {
        [Required(ErrorMessage = "Please enter file name")]
        public string EntityName { get; set; }

        [Required(ErrorMessage = "Please enter Entity Guid")]
        public Guid EntityId { get; set; }

        [Required(ErrorMessage = "Please enter file name")]
        public string FileName { get; set; }

        [Required(ErrorMessage = "Please specify file content type")]
        public string ContentType { get; set; }
        public string Tag1 { get; set; }
        public string Tag2 { get; set; }
        public string Tag3 { get; set; }
        public string Body { get; set; } //Base64Encoded
    }
}
