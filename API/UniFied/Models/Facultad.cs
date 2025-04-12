using System;
using System.Collections.Generic;

namespace UniFied.Models;

public partial class Facultad
{
    public int Id { get; set; }

    public string Nombre { get; set; } = null!;

    public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
}
