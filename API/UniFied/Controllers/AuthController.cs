using UniFied.DTOs;
using UniFied.Services;
using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace UniFied.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly IWebHostEnvironment _environment;

        public AuthController(AuthService authService, IWebHostEnvironment environment)
        {
            _authService = authService;
            _environment = environment;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDTO>> Login(LoginDTO loginDTO)
        {
            try
            {
                var response = await _authService.Login(loginDTO);
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpPost("registro")]
        public async Task<ActionResult<LoginResponseDTO>> Registro([FromForm] registroDTO registroDTO, IFormFile fotoPerfil)
        {
            try
            {
                if (fotoPerfil != null && fotoPerfil.Length > 0)
                {
                    // Obtener la ruta base del proyecto
                    var basePath = Path.GetDirectoryName(_environment.ContentRootPath);
                    // Crear la ruta completa a la carpeta de perfiles
                    var uploadsFolder = Path.Combine(basePath, "..", "assets", "perfiles");
                    
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    // Generar nombre único para la imagen
                    var fileName = $"{registroDTO.Correo}{Path.GetExtension(fotoPerfil.FileName)}";
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    // Guardar la imagen
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await fotoPerfil.CopyToAsync(stream);
                    }

                    // Actualizar la ruta de la imagen en el DTO
                    registroDTO.ImagenPerfil = $"assets/perfiles/{fileName}";
                }

                var response = await _authService.Registro(registroDTO);
                return Ok(response);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}