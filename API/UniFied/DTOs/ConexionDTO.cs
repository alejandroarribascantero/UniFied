namespace UniFied.DTOs;
public class ConexionDTO
{
    public int Id { get; set; }
    public int UsuarioId1 { get; set; }
    public int UsuarioId2 { get; set; }
    public string Estado { get; set; }
    public DateTime FechaSolicitud { get; set; }
    public string NombreSolicitante { get; set; }
    public string ApellidoSolicitante { get; set; }
    public string ImagenPerfilSolicitante { get; set; }
    public string Facultad { get; set; }
    public string Curso { get; set; }
}