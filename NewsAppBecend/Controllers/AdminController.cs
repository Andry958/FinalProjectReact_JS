using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NewsAppBecend.Model;
using NewsAppBecend.Model.DB;
using System.Collections.Generic;
using System.Linq;

namespace NewsAppBecend.Controllers
{
    [Route("api/main")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly NewsDbContext _context;
        public AdminController(NewsDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult AddNews([FromBody] List<NewsItem> newsItems)
        {
            if (newsItems == null || !newsItems.Any())
            {
                return BadRequest("No news items provided.");
            }

            var invalidItems = newsItems.Where(n => string.IsNullOrEmpty(n.Title) || string.IsNullOrEmpty(n.Content)).ToList();
            if (invalidItems.Any())
            {
                return BadRequest("Some news items have invalid data (missing Title or Content).");
            }

            _context.NewsItems.AddRange(newsItems);
            _context.SaveChanges();

            return Ok( newsItems);
        }

        [HttpDelete]
        public IActionResult Delete()
        {
            _context.NewsItems.RemoveRange(_context.NewsItems);
            _context.SaveChanges();
            return Ok("All news items deleted successfully.");
        }

    }
}
