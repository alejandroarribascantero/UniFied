namespace API_UniFied.Models
{
    public enum Genero
    {
        HOMBRE,
        MUJER
    }

    public enum tipo_id
    {
        DNI,
        PASAPORTE,
        NIE
    }

    public enum Eneatipo
    {
        REFORMADOR,
        AYUDADOR,
        TRIUNFADOR,
        INDIVIDUALISTA,
        INVESTIGADOR,
        LEAL,
        ENTUSIASTA,
        DESAFIADOR,
        PACIFICADOR,
    }

    public enum Estudios
    {
        GRADO, 
        CETIS, 
        MASTER
    }

    public enum Facultad
    {
        DERECHO_EMPRESA_GOBIERNO,

    }

    public class Alumno
    {
        public int Id { get; set; }
        public required string Nombre { get; set; }
        public required string Apellido1 { get; set; }
        public required string Apellido2 { get; set; }
        public int Edad {  get; set; }
    }
}
