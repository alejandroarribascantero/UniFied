using UniFied.Services;
using Microsoft.AspNetCore.Mvc;
using UniFied.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Unified.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RecomendacionController : ControllerBase
{
    private readonly RecomendacionService _recomendacionService;

    public RecomendacionController(RecomendacionService recomendacionService)
    {
        _recomendacionService = recomendacionService;
    }

    [HttpGet("usuarios")]
    public IActionResult GetUsuariosRecomendados()
    {
        try
        {
            // Obtener el ID del usuario actual desde el token
            var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            if (usuarioId == 0)
                return Unauthorized();

            var usuariosRecomendados = _recomendacionService.ObtenerUsuariosRecomendados(usuarioId);
            return Ok(usuariosRecomendados);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Ocurrió un error al obtener las recomendaciones: " + ex.Message });
        }
    }
} 