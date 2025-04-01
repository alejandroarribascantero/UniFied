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
                string sql = "SELECT * FROM Usuario";
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
                string sql = "SELECT * FROM Usuario WHERE id = @id"; 
                var usuarios = await _database.Consulta<Models.Usuario>(sql, new { id = id });
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
                string sql = "SELECT * FROM Usuario WHERE email = @email";
                var usuarios = await _database.Consulta<Models.Usuario>(sql , new { email = request.email });

                var usuario = usuarios.FirstOrDefault();

                // Verificar si el usuario existe y si la contraseña es correcta
                if (usuario == null || !BCrypt.Net.BCrypt.Verify(request.password, usuario.password))
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
        public async Task<ActionResult<Models.Usuario>> Register([FromBody] Models.Usuario nuevoUsuario)
        {
            try
            {
                string sql = "SELECT * FROM Usuario WHERE email = @email";
                // Validar que el email no esté registrado
                var usuariosExistentes = await _database.Consulta<Models.Usuario>(sql, new { email = nuevoUsuario.email });

                if (usuariosExistentes.Any())
                {
                    return Conflict("El email ya está registrado.");
                }

                // Establecer el rol por defecto como ALUMNO
                nuevoUsuario.rol = Models.Rol.ALUMNO;

                // Encriptar la contraseña antes de guardarla
                nuevoUsuario.password = BCrypt.Net.BCrypt.HashPassword(nuevoUsuario.password);

                // Insertar el nuevo usuario en la base de datos
                string sqlInsert = "INSERT INTO Usuario (email, password, rol) VALUES (@email, @password, @rol)";
                await _database.Insertar(sqlInsert, nuevoUsuario);

                return CreatedAtAction(nameof(Login), new { email = nuevoUsuario.email }, nuevoUsuario);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        public class LoginRequest
        {
            public required string email { get; set; }
            public required string password { get; set; }
        }
    }
}
