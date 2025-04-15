using UniFied.DTOs;
using UniFied.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UniFied.Data;

namespace UniFied.Services
{
    public class AuthService
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;

        public AuthService(IConfiguration configuration, AppDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        public async Task<LoginResponseDTO> Login(LoginDTO loginDTO)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Correo == loginDTO.Correo);

            if (usuario == null || !BCrypt.Net.BCrypt.Verify(loginDTO.Contrasena, usuario.Contrasena))
            {
                throw new UnauthorizedAccessException("Usuario o contraseña incorrectos.");
            }

            var token = GenerarTokenJwt(usuario);

            return new LoginResponseDTO
            {
                Token = token,
                Nombre = usuario.Nombre,
                Apellido1 = usuario.Apellido1,
                Apellido2 = usuario.Apellido2,
                Correo = usuario.Correo,
                TipoPersonalidadId = usuario.TipoPersonalidadId
            };
        }

        public async Task<LoginResponseDTO> Registro(registroDTO registroDTO)
        {
            // Verificar si el correo ya existe
            if (await _context.Usuarios.AnyAsync(u => u.Correo == registroDTO.Correo))
            {
                throw new InvalidOperationException("El correo electrónico ya está registrado.");
            }

            // Crear nuevo usuario
            var usuario = new Usuario
            {
                Correo = registroDTO.Correo,
                Contrasena = BCrypt.Net.BCrypt.HashPassword(registroDTO.Contrasena),
                Nombre = registroDTO.Nombre,
                Apellido1 = registroDTO.Apellido1,
                Apellido2 = registroDTO.Apellido2,
                FechaNacimiento = registroDTO.FechaNacimiento,
                FacultadId = registroDTO.FacultadId,
                Curso = registroDTO.Curso
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            var token = GenerarTokenJwt(usuario);

            return new LoginResponseDTO
            {
                Token = token,
                Nombre = usuario.Nombre,
                Apellido1 = usuario.Apellido1,
                Apellido2 = usuario.Apellido2,
                Correo = usuario.Correo
            };
        }

        private string GenerarTokenJwt(Usuario usuario)
        {
            var jwtKey = _configuration["Jwt:Key"];

            // Para que no sea null
            if (string.IsNullOrEmpty(jwtKey))
            {
                throw new InvalidOperationException("JWT Key is not configured.");
            }

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Email, usuario.Correo),
                new Claim(ClaimTypes.Name, $"{usuario.Nombre} {usuario.Apellido1}")
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}