using Microsoft.AspNetCore.Mvc;
using MySqlConnector;

namespace API_UniFied.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly string _connectionString;

        public UsuarioController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        // GET: api/Usuario
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios()
        {
            var usuarios = new List<Usuario>();

            try
            {
                using (var connection = new MySqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (var command = new MySqlCommand("SELECT * FROM Usuarios", connection))
                    {
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                usuarios.Add(new Usuario
                                {
                                    Id = reader.GetInt32("Id"),
                                    Nombre = reader.GetString("Nombre"),
                                    Email = reader.GetString("Email"),
                                    Edad = reader.GetInt32("Edad")
                                });
                            }
                        }
                    }
                }

                // Si no se encontraron usuarios, devolver 404 Not Found
                if (usuarios.Count == 0)
                {
                    return NotFound("No se encontraron usuarios.");
                }

                return Ok(usuarios);
            }
            catch (Exception ex)
            {
                // En caso de error en la consulta o conexión, devolver un 500 con el error
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
    }
}
