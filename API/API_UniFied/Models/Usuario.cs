using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
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

        public required int id { get; set; }

        public required Rol rol { get; set; }

        public required string password { get; set; }

        public required string email { get; set; }
    }
}
