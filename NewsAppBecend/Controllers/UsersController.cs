using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NewsAppBecend.Model;
using NewsAppBecend.Model.DB;

namespace NewsAppBecend.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly NewsDbContext _context;
        public UsersController(NewsDbContext context)
        {
            _context = context;
        }

        [HttpPut]
        public IActionResult EditUser([FromBody] User updatedUser)
        {
            if (string.IsNullOrWhiteSpace(updatedUser.Username) || updatedUser == null)
            {
                return BadRequest("Username and user data cannot be empty.");
            }

            var user = _context.Users.FirstOrDefault(u => u.Username == updatedUser.Username);
            if (user == null)
            {
                return NotFound($"User with username '{updatedUser.Username}' not found.");
            }

            // Оновлюємо дані користувача
            user.Email = updatedUser.Email;
            user.Password = updatedUser.Password;
            user.Description = updatedUser.Description;
            // Зазвичай пароль хешується, але для простоти тут не хешуємо
            _context.SaveChanges();

            return Ok($"User '{updatedUser.Username}' updated successfully.");
        }

        [HttpGet]
        public IActionResult GetUsers()
        {
            var users = _context.Users.ToList();
            return Ok(users);
        }
        [HttpGet("{username}")]
        public IActionResult GetUser(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                return BadRequest("Username cannot be empty.");
            }

            var user = _context.Users.FirstOrDefault(u => u.Username == username);
            if (user == null)
            {
                return NotFound($"User with username '{username}' not found.");
            }// мені потрібно передати цей обєкт але без password
            var userWithoutPassword = new
            {
                user.Id,
                user.Avatar,
                user.Description,
                user.Name,
                user.Email,
                user.Username,
                user.Role
            };


            return Ok(userWithoutPassword);
        }
        [HttpDelete("{username}")]
        public IActionResult DeleteUsers(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                return BadRequest("Username cannot be empty.");
            }

            var user = _context.Users.FirstOrDefault(u => u.Username == username);
            if (user == null)
            {
                return NotFound($"User with username '{username}' not found.");
            }

            _context.Users.Remove(user);
            _context.SaveChanges();
            return Ok($"User '{username}' deleted successfully.");

        }
        [HttpPatch("{username}/{admin}")]
        public IActionResult UpdateRole(string username, bool admin)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                return BadRequest("Username cannot be empty.");
            }

            var user = _context.Users.FirstOrDefault(u => u.Username == username);
            if (user == null)
            {
                return NotFound($"User with username '{username}' not found.");
            }

            user.Role = admin ? "admin" : "user";
            _context.SaveChanges();
            return Ok($"User '{username}' role updated to '{user.Role}'.");
        }
    }
}
