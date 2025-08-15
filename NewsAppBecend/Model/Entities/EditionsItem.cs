using System.ComponentModel.DataAnnotations;

namespace NewsAppBecend.Model.Entities
{
    public class EditionsItem
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public List<User> Users { get; set; } = new();
    }
}
