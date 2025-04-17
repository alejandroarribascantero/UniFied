namespace UniFied.DTOs;

public class UsuarioRecomendadoDTO
{
    public int Id { get; set;}
    public string Nombre { get; set; } = null!;
    public string Apellido1 { get; set; } = null!;
    public string? Apellido2 { get; set; }
    public string? ImagenPerfil { get; set; }
    public int FacultadId { get; set; }
    public string NombreFacultad { get; set; } = null!;
    public decimal Curso { get; set; }
} 