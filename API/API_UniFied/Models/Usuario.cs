using System.ComponentModel.DataAnnotations;

namespace API_UniFied.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public required string Nombre { get; set; }
        public required string Email { get; set; }
        public required int Edad { get; set; }
        public required string Contrasena { get; set; }
    }
}
