using UniFied.Services;
using Microsoft.AspNetCore.Mvc;
using UniFied.DTOs;
using Microsoft.AspNetCore.Authorization;


namespace Unified.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConexionesController : ControllerBase
{
    private readonly ConexionService _conexionService;

    public ConexionesController(ConexionService conexionService)
    {
        _conexionService = conexionService;
    }

    // Enviar solicitud de conexión
    [HttpPost("enviar")]
    public IActionResult EnviarSolicitudConexion([FromBody] SolicitudConexionDTO solicitud)
    {
        if (solicitud.Usuario1Id == solicitud.Usuario2Id)
            return BadRequest(new { mensaje = "No puedes enviarte una solicitud a ti mismo." });

        try
        {
            _conexionService.EnviarSolicitudConexion(solicitud);
            return Ok(new { mensaje = "Solicitud enviada correctamente." });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
    }

    // Aceptar solicitud de conexión
    [HttpPost("aceptar")]
    public IActionResult AceptarSolicitud([FromBody] SolicitudConexionDTO solicitud)
    {
        try
        {
            _conexionService.AceptarSolicitud(solicitud.Usuario1Id, solicitud.Usuario2Id);
            return Ok(new { mensaje = "Solicitud aceptada correctamente." });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
    }

    // Rechazar solicitud de conexión
    [HttpPost("rechazar")]
    public IActionResult RechazarSolicitud([FromBody] SolicitudConexionDTO solicitud)
    {
        try
        {
            _conexionService.RechazarSolicitud(solicitud.Usuario1Id, solicitud.Usuario2Id);
            return Ok(new { mensaje = "Solicitud rechazada correctamente." });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
    }

    // Bloquear solicitud de conexión
    [HttpPost("bloquear")]
    public IActionResult BloquearSolicitud([FromBody] SolicitudConexionDTO solicitud)
    {
        try
        {
            _conexionService.BloquearSolicitud(solicitud.Usuario1Id, solicitud.Usuario2Id);
            return Ok(new { mensaje = "Solicitud bloqueada correctamente." });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
    }

    // Obtener solicitudes pendientes
    [HttpGet("pendientes")]
    public IActionResult ObtenerSolicitudesPendientes()
    {
        try
        {
            var usuarioId = int.Parse(User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value);
            var solicitudes = _conexionService.ObtenerSolicitudesPendientes(usuarioId);
            return Ok(solicitudes);
        }
        catch (Exception ex)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
    }

    // Obtener amigos
    [HttpGet("amigos")]
    public IActionResult ObtenerAmigos()
    {
        try
        {
            var usuarioId = int.Parse(User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value);
            var amigos = _conexionService.ObtenerAmigos(usuarioId);
            return Ok(amigos);
        }
        catch (Exception ex)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
    }
}
