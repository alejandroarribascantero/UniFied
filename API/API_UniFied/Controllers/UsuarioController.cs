﻿using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;

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
                var usuarios = await _database.Consulta<Models.Usuario>(
                    sql,
                    new { Email = request.Email }
                );

                var usuario = usuarios.FirstOrDefault();

                // Verificar si el usuario existe y si la contraseña es correcta
                if (
                    usuario == null
                    || !BCrypt.Net.BCrypt.Verify(request.Contrasena, usuario.password)
                )
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

        [HttpPost("registro")]
        public async Task<ActionResult<Models.Usuario>> RegisterUsuario(
            [FromBody] RegisterRequest request
        )
        {
            try
            {
                // Establecer el rol por defecto como ALUMNO
                if (request.Usuario.rol == 0)
                {
                    request.Usuario.rol = Models.Rol.ALUMNO;
                }

                // Validar que el email no esté registrado
                string sql = "SELECT * FROM Usuario WHERE email = @Email";
                var usuariosExistentes = await _database.Consulta<Models.Usuario>(
                    sql,
                    new { Email = request.Usuario.email }
                );

                if (usuariosExistentes.Any())
                {
                    return Conflict("El email ya está registrado.");
                }

                // Validar que la contraseña tenga al menos 8 caracteres
                if (request.Usuario.password.Length < 8)
                {
                    return BadRequest("La contraseña debe tener al menos 8 caracteres.");
                }

                // Encriptar la contraseña antes de guardarla
                request.Usuario.password = BCrypt.Net.BCrypt.HashPassword(request.Usuario.password);

                // Insertar el nuevo usuario en la base de datos
                string sqlInsertUsuario =
                    @"INSERT INTO Usuario (Email, Password, Rol) 
                                   VALUES (@Email, @Password, @Rol); 
                                   SELECT LAST_INSERT_ID();";
                int usuarioId = await _database.Insertar(sqlInsertUsuario, request.Usuario);

                // Si el rol es ALUMNO, registrar en la tabla Alumno
                if (request.Usuario.rol == Models.Rol.ALUMNO && request.Alumno != null)
                {
                    string sqlInsertAlumno =
                        @"INSERT INTO Alumno (fk_usuario, nombre, apellido1, apellido2, edad, genero, tipo_identificacion, identificacion, eneatipo, estudios, facultad) 
                                        VALUES (@fk_usuario, @Nombre, @Apellido1, @Apellido2, @Edad, @Genero, @Tipo_Identificacion, @Identificacion, NULL, @Estudios, @Facultad);";

                    await _database.Insertar(
                        sqlInsertAlumno,
                        new
                        {
                            fk_usuario = usuarioId,
                            Nombre = request.Alumno.nombre,
                            Apellido1 = request.Alumno.apellido1,
                            Apellido2 = request.Alumno.apellido2,
                            Edad = request.Alumno.edad,
                            Genero = request.Alumno.genero.ToString(),
                            Tipo_Identificacion = request.Alumno.tipo_Identificacion.ToString(),
                            Identificacion = request.Alumno.identificacion,
                            Estudios = request.Alumno.estudios.ToString(),
                            Facultad = request.Alumno.facultad.ToString(),
                        }
                    );
                }

                return CreatedAtAction(
                    nameof(RegisterUsuario),
                    new { email = request.Usuario.email },
                    request.Usuario
                );
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

        public class RegisterRequest
        {
            public required Models.Usuario Usuario { get; set; }

            public Models.Alumno? Alumno { get; set; }
        }
    }
}
