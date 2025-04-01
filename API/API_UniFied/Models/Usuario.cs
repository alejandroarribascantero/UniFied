using System.ComponentModel.DataAnnotations;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace API_UniFied.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public required string Nombre { get; set; }
        public required string Apellidos { get; set; }
        public required string Email { get; set; }
        public required string DNI { get; set; }
        public required string Carrera { get; set; }
        public required string Contrasena { get; set; }

    }
}
