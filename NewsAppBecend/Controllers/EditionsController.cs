using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewsAppBecend.Model;
using NewsAppBecend.Model.DB;
using NewsAppBecend.Model.Dto;

namespace NewsAppBecend.Controllers
{
    [Route("api/editions")]
    [ApiController]
    public class EditionsController : ControllerBase
    {
        private readonly NewsDbContext _context;

        public EditionsController(NewsDbContext context)
        {
            _context = context;
        }
        [HttpGet("allEd")]
        public IActionResult All()
        {
            var editions = _context.EditionsItems
                .Select(e => new { e.Name })
                .ToList();
            return Ok(editions);
        }
           [HttpDelete("{editionName}/{username}")]
        public async Task<IActionResult> DeleteEdition(string editionName, string username)
        {
            if (string.IsNullOrWhiteSpace(editionName) || string.IsNullOrWhiteSpace(username))
                return BadRequest("Edition name and username cannot be empty.");

            var user = await _context.Users
                .Include(u => u.Editions)
                .FirstOrDefaultAsync(u => u.Username == username);

            if (user == null)
                return NotFound($"User '{username}' not found.");

            var edition = user.Editions.FirstOrDefault(e => e.Name == editionName);
            if (edition == null)
                return NotFound($"Edition '{editionName}' not found for user '{username}'.");

            user.Editions.Remove(edition);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Edition deleted successfully." });
        }

        [HttpGet("{username}")]
        public async Task<IActionResult> GetEditionsForUser(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
                return BadRequest("Username cannot be empty.");

            var editions = await _context.Users
                .Where(u => u.Username == username)
                .SelectMany(u => u.Editions.Select(e => e.Name))
                .ToListAsync();

            if (!editions.Any())
                return NotFound($"No editions found for user '{username}'.");

            return Ok(editions);
        }

        [HttpGet("all/{username}")]
        public async Task<IActionResult> GetAllEditions(
            string username,
            [FromQuery] string? search = null,
            [FromQuery] string? sortBy = "publishedAt",
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 18,
            [FromQuery] string? source = null)
        {
            if (string.IsNullOrWhiteSpace(username))
                return BadRequest("Username cannot be empty.");

            var editions = await _context.Users
                .Where(u => u.Username == username)
                .SelectMany(u => u.Editions.Select(e => e.Name))
                .ToListAsync();

            if (!editions.Any())
                return Ok(new { items = new List<object>(), totalItems = 0 });

            var query = _context.NewsItems
                .Where(n => editions.Contains(n.Name));

            if (!string.IsNullOrWhiteSpace(source))
                query = query.Where(n => n.Name == source);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var lowered = search.ToLower();
                query = query.Where(n =>
                    n.Title.ToLower().Contains(lowered) ||
                    n.Description.ToLower().Contains(lowered));
            }

            query = sortBy?.ToLower() switch
            {
                "title" => query.OrderBy(n => n.Title),
                "author" => query.OrderBy(n => n.Author),
                _ => query.OrderByDescending(n => n.PublishedAt)
            };

            var totalItems = await query.CountAsync();
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                items,
                totalItems
            });
        }

        [HttpPost("addforuser")]
        public async Task<IActionResult> AddForUser([FromBody] AddForUserDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.EditionName))
                return BadRequest("Username and EditionName cannot be empty.");

            var user = await _context.Users
                .Include(u => u.Editions)
                .FirstOrDefaultAsync(u => u.Username == dto.Username);
            if (user == null)
                return NotFound($"User '{dto.Username}' not found.");

            var edition = await _context.EditionsItems.FirstOrDefaultAsync(e => e.Name == dto.EditionName);
            if (edition == null)
                return NotFound($"Edition '{dto.EditionName}' not found.");

            if (user.Editions.Any(e => e.Name == dto.EditionName))
                return Conflict($"User '{dto.Username}' already has the edition '{dto.EditionName}'.");

            user.Editions.Add(edition);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Edition added successfully." });
        }

        [HttpPost]
        public async Task<IActionResult> AddEditions([FromBody] List<EditionsItemDto> editions)
        {
            if (editions == null || !editions.Any())
                return BadRequest("No editions provided.");

            var invalid = editions.Where(e => string.IsNullOrWhiteSpace(e.Name)).ToList();
            if (invalid.Any())
                return BadRequest("Some editions have missing or invalid names.");

            var names = editions.Select(e => e.Name).ToList();

            var existingNames = await _context.EditionsItems
                .Where(e => names.Contains(e.Name))
                .Select(e => e.Name)
                .ToListAsync();

            var newEditions = editions
                .Where(e => !existingNames.Contains(e.Name))
                .Select(e => new EditionsItem { Name = e.Name })
                .ToList();

            if (newEditions.Any())
            {
                _context.EditionsItems.AddRange(newEditions);
                await _context.SaveChangesAsync();
            }

            return Ok(new
            {
                added = newEditions.Select(e => e.Name).ToList(),
                skipped = existingNames
            });
        }
        [HttpGet("countsub/{name}")]
        public async Task<IActionResult> CountSub(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return BadRequest("Edition name cannot be empty.");

            var count = await _context.Users
                .Where(u => u.Editions.Any(e => e.Name == name))
                .CountAsync();

            return Ok(new { count });
        }
       


    }
}
