using System;
using System.Collections.Generic;

namespace UniFied.Models;

public partial class TipoPersonalidad
{
    public int Id { get; set; }

    public string? Nombre { get; set; }

    public string? CodigoMbti { get; set; }

    public string? Rol { get; set; }

    public string? Estrategia { get; set; }

    public string? Descripcion { get; set; }

    public virtual ICollection<Pregunta> PreguntaPersonalidadANavigations { get; set; } = new List<Pregunta>();

    public virtual ICollection<Pregunta> PreguntaPersonalidadBNavigations { get; set; } = new List<Pregunta>();

    public virtual ICollection<Pregunta> PreguntaPersonalidadCNavigations { get; set; } = new List<Pregunta>();

    public virtual ICollection<Pregunta> PreguntaPersonalidadDNavigations { get; set; } = new List<Pregunta>();

    public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
}
