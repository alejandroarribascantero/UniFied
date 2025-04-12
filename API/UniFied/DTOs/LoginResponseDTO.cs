namespace UniFied.DTOs;

public class LoginResponseDTO
{
    public string Token { get; set; } = null!;
    public string Nombre { get; set; } = null!;
    public string Apellido1 { get; set; } = null!;
    public string? Apellido2 { get; set; }
    public string Correo { get; set; } = null!;
} 