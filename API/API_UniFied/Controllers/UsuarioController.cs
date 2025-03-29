using Microsoft.AspNetCore.Mvc;
using BCrypt.Net;

namespace API_UniFied.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly Database _database;

        public UsuarioController(Database database)
        {
            _database = database;
        }

        // GET: api/Usuario
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios()
        {
            try
            {
                var usuarios = await _database.Consulta<Usuario>("SELECT * FROM Usuarios");

                if (usuarios == null)
                {
                    return NotFound("No se encontraron usuarios.");
                }

                return Ok(usuarios);
            }
            catch (Exception ex)
            {

                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // POST: api/Usuario/login
        [HttpPost("login")]
        public async Task<ActionResult<Usuario>> Login([FromBody] LoginRequest request)
        {
            try
            {
                var usuarios = await _database.Consulta<Usuario>("SELECT * FROM Usuarios WHERE Email = @Email", new { Email = request.Email });

                var usuario = usuarios.FirstOrDefault();

                // Verificar si el usuario existe y si la contraseña es correcta
                if (usuario == null || !BCrypt.Net.BCrypt.Verify(request.Contrasena, usuario.Contrasena))
                {
                    return Unauthorized("Usuario o contraseña incorrectos.");
                }

                return Ok(usuario);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // POST: api/Usuario/register
        [HttpPost("register")]
        public async Task<ActionResult<Usuario>> Register([FromBody] Usuario nuevoUsuario)
        {
            try
            {
                // Validar que el email no esté registrado
                var usuariosExistentes = await _database.Consulta<Usuario>("SELECT * FROM Usuarios WHERE Email = @Email", new { Email = nuevoUsuario.Email });

                if (usuariosExistentes.Any())
                {
                    return Conflict("El email ya está registrado.");
                }

                // Encriptar la contraseña antes de guardarla
                nuevoUsuario.Contrasena = BCrypt.Net.BCrypt.HashPassword(nuevoUsuario.Contrasena);

                // Insertar el nuevo usuario en la base de datos
                var sql = "INSERT INTO Usuarios (Nombre, Email, Edad, Contrasena) VALUES (@Nombre, @Email, @Edad, @Contrasena)";
                await _database.Insertar(sql, nuevoUsuario);

                return CreatedAtAction(nameof(Login), new { email = nuevoUsuario.Email }, nuevoUsuario);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        public class LoginRequest
        {
            public required string Email { get; set; }
            public required string Contrasena { get; set; }
        }
    }
}
