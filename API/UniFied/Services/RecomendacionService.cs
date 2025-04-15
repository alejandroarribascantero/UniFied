using UniFied.DTOs;
using UniFied.Data;
using UniFied.Models;
using Microsoft.EntityFrameworkCore;

namespace UniFied.Services;

public class RecomendacionService
{
    private readonly AppDbContext _context;

    public RecomendacionService(AppDbContext context)
    {
        _context = context;
    }

    public List<UsuarioRecomendadoDTO> ObtenerUsuariosRecomendados(int usuarioId)
    {
        // Obtener el tipo de personalidad del usuario actual
        var usuarioActual = _context.Usuarios
            .Include(u => u.Facultad)
            .FirstOrDefault(u => u.Id == usuarioId);

        if (usuarioActual == null || usuarioActual.TipoPersonalidadId == null)
            return new List<UsuarioRecomendadoDTO>();

        // Obtener IDs de usuarios con los que ya tiene conexión
        var usuariosConectados = _context.ConexionesUsuarios
            .Where(c => (c.UsuarioId1 == usuarioId || c.UsuarioId2 == usuarioId) && c.Estado == "aceptada")
            .Select(c => c.UsuarioId1 == usuarioId ? c.UsuarioId2 : c.UsuarioId1)
            .ToList();

        // Obtener usuarios con el mismo tipo de personalidad, excluyendo al usuario actual y sus conexiones
        var usuariosRecomendados = _context.Usuarios
            .Include(u => u.Facultad)
            .Where(u => u.TipoPersonalidadId == usuarioActual.TipoPersonalidadId 
                && u.Id != usuarioId 
                && !usuariosConectados.Contains(u.Id))
            .OrderBy(_ => EF.Functions.Random()) // Usar la función RAND() de MySQL
            .Take(5)
            .Select(u => new UsuarioRecomendadoDTO
            {
                Nombre = u.Nombre,
                Apellido1 = u.Apellido1,
                Apellido2 = u.Apellido2,
                ImagenPerfil = u.ImagenPerfil,
                FacultadId = u.FacultadId,
                NombreFacultad = u.Facultad.Nombre,
                Curso = u.Curso
            })
            .ToList();

        return usuariosRecomendados;
    }
} 