using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NewsAppBecend.Model;
using NewsAppBecend.Model.DB;
using NewsAppBecend.Model.Dto;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace NewsAppBecend.Controllers
{
    [Route("api/lr")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly NewsDbContext _context;
        private readonly IWebHostEnvironment _env;

        public AuthController(NewsDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto l)
        {
            var user = _context.Users
                .FirstOrDefault(u => u.Username == l.Username && u.Password == l.Password);
            if (user == null)
            {
                return Unauthorized("Invalid username or password");
            }
            else
            {
                return Ok(user);
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] RegisterDto l)
        {
            try
            {

            if (_context.Users.Any(u => u.Username == l.Username))
            {
                return BadRequest("Username already exists");
            }

            string avatarUrl = null;

                if (l.Avatar != null && l.Avatar.Length > 0)
                {
                    var uploadsFolder = Path.Combine($"C:\\Users\\111\\Desktop\\Main\\JSReact\\Final-Project-ReactJs\\NewsAppBecend\\Avatars\\");
                    Directory.CreateDirectory(uploadsFolder);

                    var fileName = $"{Guid.NewGuid()}{Path.GetExtension(l.Avatar.FileName)}";
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await l.Avatar.CopyToAsync(stream);
                    }
                    avatarUrl = $"/avatars/{fileName}";

                }
                    User user = new User
                    {
                        Description = l.Description,
                        Name = l.Name,
                        Email = l.Email,
                        Username = l.Username,
                        Password = l.Password,
                        Role = l.Role,
                        Editions = new List<EditionsItem>(),
                        Avatar = avatarUrl
                    };

                    _context.Users.Add(user);
                    await _context.SaveChangesAsync();

                    return Ok(new { message = "User registered successfully", avatarUrl });
                }
            catch (Exception ex)
            {
                return BadRequest($"Error processing avatar: {ex.Message}");
            }
        }
    }
}
