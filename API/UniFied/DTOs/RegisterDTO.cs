namespace UniFied.DTOs;

public class registroDTO
{
    public string Correo { get; set; } = null!;
    public string Contrasena { get; set; } = null!;
    public string Nombre { get; set; } = null!;
    public string Apellido1 { get; set; } = null!;
    public string? Apellido2 { get; set; }
    public DateTime FechaNacimiento {get; set;}
    public int FacultadId { get; set; }
    public decimal Curso { get; set; }
} 