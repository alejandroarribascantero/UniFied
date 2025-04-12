namespace UniFied.DTOs;

public class PreguntaDTO{
    public int Id { get; set; }
    public string Pregunta { get; set; } = null!;
    public List<string> Opciones { get; set; } = null!;
}