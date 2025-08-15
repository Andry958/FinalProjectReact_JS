namespace NewsAppBecend.Model.Dto
{
    public class RegisterDto
    {
        public IFormFile Avatar { get; set; }
        public string Description { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public List<EditionsItem>? Editions { get; set; } = new();
    }
}
