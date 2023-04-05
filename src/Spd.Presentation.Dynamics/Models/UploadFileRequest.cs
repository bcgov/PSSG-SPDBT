using System.ComponentModel.DataAnnotations;

namespace Spd.Presentation.Dynamics.Models
{
    public class UploadFileRequest
    {
        [Required(ErrorMessage = "Please add a file")]
        public IFormFile File { get; set; }
    }
}
