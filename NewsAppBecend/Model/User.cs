using NewsAppBecend.Model.DB;

namespace NewsAppBecend.Model
{
    public class User
    {
        public Guid Id { get; set; }
        public string Avatar { get; set; }
        public string Description { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public List<EditionsItem> Editions { get; set; } = new();
    }
}
