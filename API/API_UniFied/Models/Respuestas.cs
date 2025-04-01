namespace API_UniFied.Models
{
    public class Respuestas
    {
        public required int id { get; set; }
        public required string respuesta { get; set; }
        public required int id_pregunta { get; set; }
    }
}
