using System;
using System.Collections.Generic;

namespace UniFied.Models;

public partial class RespuestasTest
{
    public int Id { get; set; }

    public int UsuarioId { get; set; }

    public int PreguntaId { get; set; }

    public string OpcionElegida { get; set; } = null!;

    public DateTime? FechaRespuesta { get; set; }

    public virtual Pregunta Pregunta { get; set; } = null!;

    public virtual Usuario Usuario { get; set; } = null!;
}
