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
        public async Task<ActionResult<IEnumerable<Models.Usuario>>> GetUsuarios()
        {
            try
            {
                string sql = "SELECT * FROM Usuarios";
                var usuarios = await _database.Consulta<Models.Usuario>(sql);

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

        // GET: api/Usuario/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Models.Usuario>> GetUsuario(int id)
        {
            try
            {
                //Modificar el sql para obtener solo los datos que queremos
                string sql = "SELECT * FROM Usuarios WHERE ID = @Id"; 
                var usuarios = await _database.Consulta<Models.Usuario>(sql, new { Id = id });
                var usuario = usuarios.FirstOrDefault();

                if (usuario == null)
                {
                    return NotFound($"No se encontró el usuario con ID {id}.");
                }

                return Ok(usuario);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // POST: api/Usuario/login
        [HttpPost("login")]
        public async Task<ActionResult<Models.Usuario>> Login([FromBody] LoginRequest request)
        {
            try
            {
                string sql = "SELECT * FROM Usuarios WHERE Email = @Email";
                var usuarios = await _database.Consulta<Models.Usuario>(sql , new { Email = request.Email });

                var usuario = usuarios.FirstOrDefault();

                // Verificar si el usuario existe y si la contraseña es correcta
                if (usuario == null || !BCrypt.Net.BCrypt.Verify(request.Contrasena, usuario.password))
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
        [HttpPost("register-usuario")]
        public async Task<ActionResult<Models.Usuario>> RegisterUsuario([FromBody] Models.Usuario nuevoUsuario)
        {
            try
            {
                // Validar que el email no esté registrado
                string sql = "SELECT * FROM Usuarios WHERE Email = @Email";
                var usuariosExistentes = await _database.Consulta<Models.Usuario>(sql, new { Email = nuevoUsuario.email });

                if (usuariosExistentes.Any())
                {
                    return Conflict("El email ya está registrado.");
                }

                // Validar que la contraseña tenga al menos 8 caracteres
                if (nuevoUsuario.password.Length < 8)
                {
                    return BadRequest("La contraseña debe tener al menos 8 caracteres.");
                }

                // Encriptar la contraseña antes de guardarla
                nuevoUsuario.password = BCrypt.Net.BCrypt.HashPassword(nuevoUsuario.password);

                // Insertar el nuevo usuario en la base de datos
                string sqlInsert = @"INSERT INTO Usuarios (Email, Password, Rol) 
                             VALUES (@Email, @Password, @Rol)";
                await _database.Insertar(sqlInsert, nuevoUsuario);

                return CreatedAtAction(nameof(RegisterUsuario), new { email = nuevoUsuario.email }, nuevoUsuario);
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
