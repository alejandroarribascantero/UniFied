using System;
using System.Collections.Generic;

namespace UniFied.Models;

public partial class Pregunta
{
    public int Id { get; set; }

    public string Pregunta1 { get; set; } = null!;

    public string OpcionA { get; set; } = null!;

    public string OpcionB { get; set; } = null!;

    public string OpcionC { get; set; } = null!;

    public string OpcionD { get; set; } = null!;

    public int PersonalidadA { get; set; }

    public int PersonalidadB { get; set; }

    public int PersonalidadC { get; set; }

    public int PersonalidadD { get; set; }

    public virtual TipoPersonalidad PersonalidadANavigation { get; set; } = null!;

    public virtual TipoPersonalidad PersonalidadBNavigation { get; set; } = null!;

    public virtual TipoPersonalidad PersonalidadCNavigation { get; set; } = null!;

    public virtual TipoPersonalidad PersonalidadDNavigation { get; set; } = null!;

    public virtual ICollection<RespuestasTest> RespuestasTests { get; set; } = new List<RespuestasTest>();
}
