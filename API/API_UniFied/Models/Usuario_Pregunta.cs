namespace API_UniFied.Models
{
    public class Usuario_Pregunta
    {
        public required int id { get; set; }
        public required int id_usuario { get; set; }
        public required int id_pregunta { get; set; }
        public required int id_respuesta { get; set; }
    }
}
