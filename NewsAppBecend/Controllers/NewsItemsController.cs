using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewsAppBecend.Model;
using NewsAppBecend.Model.DB;
using NewsAppBecend.Model.Dto;

namespace NewsAppBecend.Controllers
{
    [Route("api/newsitems")]
    [ApiController]
    public class NewsItemsController : ControllerBase
    {
        private readonly NewsDbContext _context;
        public NewsItemsController(NewsDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetNews(
            int pageNumber = 1,
            int pageSize = 18,
            string? search = null,
            string? sortBy = null,
            string? source = null)
        {
            var query = _context.NewsItems.AsQueryable();

            // 🔍 Фільтрація по пошуку
            if (!string.IsNullOrEmpty(search))
            {
                string lowered = search.ToLower();
                query = query.Where(n =>
                    n.Title.ToLower().Contains(lowered) ||
                    n.Description.ToLower().Contains(lowered));
            }

            // 📌 Фільтрація по джерелу
            if (!string.IsNullOrEmpty(source))
            {
                query = query.Where(n => n.Name == source);
            }

            // 🔃 Гарантоване сортування
            query = (sortBy ?? "publishedAt").ToLower() switch
            {
                "title" => query.OrderBy(n => n.Title),
                "author" => query.OrderBy(n => n.Author),
                _ => query.OrderByDescending(n => n.PublishedAt)
            };

            var totalItems = await query.CountAsync();

            // 🧹 Повертаємо лише потрібні поля
            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                currentPage = pageNumber,
                pageSize = pageSize,
                totalItems,
                totalPages = (int)Math.Ceiling(totalItems / (double)pageSize),
                items
            });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            var newsItem = _context.NewsItems.FirstOrDefault(n => n.Id == id);
            if (newsItem == null)
                return NotFound($"News item with ID '{id}' not found.");

            _context.NewsItems.Remove(newsItem);
            _context.SaveChanges();

            return Ok("News item deleted successfully.");
        }

        [HttpPost]
        public IActionResult AddNews([FromBody] List<NewsItemDto> newsItems)
        {
            if (newsItems == null || !newsItems.Any())
                return BadRequest("No news items provided.");

            var newUniqueItems = newsItems.Where(item =>
                !_context.NewsItems.Any(n => n.Title == item.Title && n.Content == item.Content)).ToList();

            if (!newUniqueItems.Any())
                return Conflict("All news items already exist.");

            var entities = newUniqueItems.Select(n => new NewsItem
            {
                Author = n.Author,
                Content = n.Content,
                Description = n.Description,
                PublishedAt = n.PublishedAt,
                Name = n.Name,
                Title = n.Title,
                Url = n.Url,
                UrlToImage = n.UrlToImage
            }).ToList();

            _context.NewsItems.AddRange(entities);
            _context.SaveChanges();

            return Ok(new { msg = "Успішно додано нові новини" });
        }
        [HttpPatch]
        public IActionResult UpdateNews([FromBody] NewsItemDto_ newsItems)
        {
        
           
                var existingItem = _context.NewsItems.FirstOrDefault(n => n.Id == newsItems.Id);
            if (existingItem != null)
                {
                    existingItem.Author = newsItems.Author;
                    existingItem.Description = newsItems.Description;
                    existingItem.PublishedAt = newsItems.PublishedAt;
                    existingItem.Name = newsItems.Name;
                    existingItem.Url = newsItems.Url;
                    existingItem.UrlToImage = newsItems.UrlToImage;
                }
                else
                {
                    _context.NewsItems.Add(new NewsItem
                    {
                        Author = newsItems.Author,
                        Content = newsItems.Content,
                        Description = newsItems.Description,
                        PublishedAt = newsItems.PublishedAt,
                        Name = newsItems.Name,
                        Title = newsItems.Title,
                        Url = newsItems.Url,
                        UrlToImage = newsItems.UrlToImage
                    });
                }
            
            _context.SaveChanges();

            return Ok(new { msg = "Успішно оновлено новини" });
        }
        [HttpPost("created")]
        public IActionResult AddSingleNews([FromBody] NewsItemDto newsItem)
        {
            _context.NewsItems.Add(new NewsItem
            {
                Author = newsItem.Author,
                Content = newsItem.Content,
                Description = newsItem.Description,
                PublishedAt = newsItem.PublishedAt,
                Name = newsItem.Name,
                Title = newsItem.Title,
                Url = newsItem.Url,
                UrlToImage = newsItem.UrlToImage
            });
            _context.SaveChanges();

            return Ok(new { msg = "Успішно додано" });
        }
    }
}
