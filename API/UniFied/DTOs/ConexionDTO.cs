namespace UniFied.DTOs;
public class ConexionDTO
{
    public int Id { get; set; }
    public int UsuarioId1 { get; set; }
    public int UsuarioId2 { get; set; }
    public string Estado { get; set; }
    public DateTime FechaSolicitud { get; set; }
}