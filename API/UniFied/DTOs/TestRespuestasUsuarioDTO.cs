namespace UniFied.DTOs;
public class TestRespuestasUsuarioDTO
{
    public int UsuarioId { get; set; }
    public List<RespuestaDTO> Respuestas { get; set; } = null!;
}