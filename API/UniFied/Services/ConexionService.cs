using UniFied.DTOs;
using UniFied.Data;
using UniFied.Models;

public class ConexionService
{
    private readonly AppDbContext _context;

    public ConexionService(AppDbContext context)
    {
        _context = context;
    }

    // Enviar solicitud de conexión
    public void EnviarSolicitudConexion(SolicitudConexionDTO solicitud)
    {
        if (solicitud.Usuario1Id == solicitud.Usuario2Id)
            throw new InvalidOperationException("No puedes enviarte una solicitud a ti mismo.");

        // Asegurarse de que los IDs estén ordenados
        int menor = Math.Min(solicitud.Usuario1Id, solicitud.Usuario2Id);
        int mayor = Math.Max(solicitud.Usuario1Id, solicitud.Usuario2Id);

        // Verificar si ya existe una conexión
        var conexionExistente = _context.ConexionesUsuarios
            .FirstOrDefault(c => c.UsuarioId1 == menor && c.UsuarioId2 == mayor);

        if (conexionExistente != null)
            throw new InvalidOperationException("Ya existe una conexión entre estos usuarios.");

        var nuevaConexion = new ConexionesUsuario
        {
            UsuarioId1 = menor,
            UsuarioId2 = mayor,
            Estado = "pendiente" // Estado inicial de la solicitud
        };

        _context.ConexionesUsuarios.Add(nuevaConexion);
        _context.SaveChanges();
    }

    // Aceptar solicitud de conexión
    public void AceptarSolicitud(int usuario1Id, int usuario2Id)
    {
        int menor = Math.Min(usuario1Id, usuario2Id);
        int mayor = Math.Max(usuario1Id, usuario2Id);

        var conexion = _context.ConexionesUsuarios
            .FirstOrDefault(c => c.UsuarioId1 == menor && c.UsuarioId2 == mayor);

        if (conexion == null)
            throw new InvalidOperationException("La conexión no existe.");

        if (conexion.Estado != "pendiente")
            throw new InvalidOperationException("Solo puedes aceptar solicitudes pendientes.");

        conexion.Estado = "aceptada";
        _context.SaveChanges();
    }

    // Rechazar solicitud de conexión
    public void RechazarSolicitud(int usuario1Id, int usuario2Id)
    {
        int menor = Math.Min(usuario1Id, usuario2Id);
        int mayor = Math.Max(usuario1Id, usuario2Id);

        var conexion = _context.ConexionesUsuarios
            .FirstOrDefault(c => c.UsuarioId1 == menor && c.UsuarioId2 == mayor);

        if (conexion == null)
            throw new InvalidOperationException("La conexión no existe.");

        if (conexion.Estado != "pendiente")
            throw new InvalidOperationException("Solo puedes rechazar solicitudes pendientes.");

        conexion.Estado = "rechazada";
        _context.SaveChanges();
    }

    // Bloquear solicitud de conexión
    public void BloquearSolicitud(int usuario1Id, int usuario2Id)
    {
        int menor = Math.Min(usuario1Id, usuario2Id);
        int mayor = Math.Max(usuario1Id, usuario2Id);

        var conexion = _context.ConexionesUsuarios
            .FirstOrDefault(c => c.UsuarioId1 == menor && c.UsuarioId2 == mayor);

        if (conexion == null)
            throw new InvalidOperationException("La conexión no existe.");

        conexion.Estado = "bloqueada";
        _context.SaveChanges();
    }
}
