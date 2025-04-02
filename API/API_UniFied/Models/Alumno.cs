using System.Text.Json.Serialization;

namespace API_UniFied.Models
{
    public enum Genero
    {
        HOMBRE,
        MUJER
    }

    public enum Tipo_identificacion
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
        CIENCIAS_COMUNICACION,
        EDUCACION_PSICOLOGIA,
        CIENCIAS_EXPERIMENTALES,
        CIENCIAS_SALUD,
        POLITECNICA_SUPERIOR,
        MEDICINA

    }

    public class Alumno
    {
        public int Id { get; set; }

        public required Genero genero { get; set; }

        public required Tipo_identificacion tipo_Identificacion { get; set; }

        public required Eneatipo eneatipo { get; set; }

        public required Estudios estudios { get; set; }

        public required Facultad facultad { get; set; }

        public required string nombre { get; set; }

        public required string apellido1 { get; set; }

        public required string apellido2 { get; set; }

        public required DateTime fecha_nacimiento { get; set; }

        public required string identificacion { get; set; }
    }
}
