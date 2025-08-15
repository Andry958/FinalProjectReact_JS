namespace NewsAppBecend.Configuration
{
    public class FileUploadSettings
    {
        public string AvatarPath { get; set; } = "wwwroot/avatars";
        public long MaxFileSize { get; set; } = 5 * 1024 * 1024; // 5MB
        public string[] AllowedExtensions { get; set; } = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
    }
}