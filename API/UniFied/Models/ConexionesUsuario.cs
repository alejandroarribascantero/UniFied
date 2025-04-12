using System;
using System.Collections.Generic;

namespace UniFied.Models;

public partial class ConexionesUsuario
{
    public int Id { get; set; }

    public int UsuarioId1 { get; set; }

    public int UsuarioId2 { get; set; }

    public string? Estado { get; set; }

    public DateTime? FechaSolicitud { get; set; }

    public virtual Usuario UsuarioId1Navigation { get; set; } = null!;

    public virtual Usuario UsuarioId2Navigation { get; set; } = null!;
}
