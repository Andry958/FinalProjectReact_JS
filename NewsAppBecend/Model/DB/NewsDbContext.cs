using Microsoft.EntityFrameworkCore;

namespace NewsAppBecend.Model.DB
{


    public class NewsDbContext : DbContext
    {
        public NewsDbContext(DbContextOptions<NewsDbContext> options) : base(options)
        {
        }

        public DbSet<NewsItem> NewsItems { get; set; }
        public DbSet<EditionsItem> EditionsItems { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<NewsItem>().ToTable("NewsItems");
            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<EditionsItem>().ToTable("EditionsItems");
        }
    }
    
}

