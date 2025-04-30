using UniFied.DTOs;
using UniFied.Models;
using UniFied.Data;
using Microsoft.EntityFrameworkCore;

namespace UniFied.Services
{
    public interface IUserProfileService
    {
        Task<UserProfileDTO> GetUserProfileAsync(string userId);
    }

    public class UserProfileService : IUserProfileService
    {
        private readonly AppDbContext _context;

        public UserProfileService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserProfileDTO> GetUserProfileAsync(string userId)
        {
            var user = await _context.Usuarios
                .Include(u => u.Facultad)
                .Include(u => u.TipoPersonalidad)
                .FirstOrDefaultAsync(u => u.Id.ToString() == userId);

            if (user == null)
            {
                throw new Exception("Usuario no encontrado");
            }

            return new UserProfileDTO
            {
                NombreCompleto = $"{user.Nombre} {user.Apellido1} {user.Apellido2}",
                Carrera = user.Facultad?.Nombre ?? "No disponible",
                FotoPerfil = user.ImagenPerfil,
                Personalidad = user.TipoPersonalidad?.Nombre ?? "No disponible",
                ImagenPersonalidad = user.TipoPersonalidad?.CodigoMbti != null 
                    ? $"/assets/personalidades/{user.TipoPersonalidad.Nombre.ToLower()}.svg" 
                    : "/assets/logo.png"
            };
        }
    }
} 