using UniFied.Services;
using Microsoft.AspNetCore.Mvc;
using UniFied.DTOs;


namespace Unified.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestPersonalidadController : ControllerBase
{
    private readonly TestService _testService;

    public TestPersonalidadController(TestService testService)
    {
        _testService = testService;
    }

    [HttpGet("preguntas")]
    public ActionResult<List<PreguntaDTO>> GetPreguntas()
    {
        return _testService.ObtenerPreguntas();
    }

    [HttpPost("responder")]
    public IActionResult PostRespuestas([FromBody] TestRespuestasUsuarioDTO test)
    {
        try
        {
            _testService.ResolverTest(test);
            return Ok(new { mensaje = "Test completado y guardado correctamente." });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Ocurrió un error al procesar el test." + ex.Message });
        }

    }
}