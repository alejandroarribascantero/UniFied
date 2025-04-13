using System;
using System.Collections.Generic;

namespace UniFied.Models;

public partial class Usuario
{
    public int Id { get; set; }

    public string Correo { get; set; } = null!;

    public string Contrasena { get; set; } = null!;

    public string Nombre { get; set; } = null!;

    public string Apellido1 { get; set; } = null!;

    public string? Apellido2 { get; set; }

    public int FacultadId { get; set; }

    public decimal Curso { get; set; }

    public DateTime FechaNacimiento { get; set; }

    public string? ImagenPerfil { get; set; }

    public int? TipoPersonalidadId { get; set; }

    public virtual ICollection<ConexionesUsuario> ConexionesUsuarioUsuarioId1Navigations { get; set; } = new List<ConexionesUsuario>();

    public virtual ICollection<ConexionesUsuario> ConexionesUsuarioUsuarioId2Navigations { get; set; } = new List<ConexionesUsuario>();

    public virtual Facultad Facultad { get; set; } = null!;

    public virtual ICollection<RespuestasTest> RespuestasTests { get; set; } = new List<RespuestasTest>();

    public virtual TipoPersonalidad? TipoPersonalidad { get; set; }
}
