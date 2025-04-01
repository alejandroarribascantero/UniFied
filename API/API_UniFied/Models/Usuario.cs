using System.ComponentModel.DataAnnotations;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace API_UniFied.Models
{
    public enum Rol
    {
        ADMIN,
        ALUMNO
    }
    public class Usuario
    {
        public int id { get; set; }
        public required Rol rol { get; set; }
        public required string password { get; set; }
        public required string email { get; set; }

    }
}
