using Microsoft.EntityFrameworkCore;

namespace API_UniFied
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Definir los DbSet para las tablas de tu base de datos
        public DbSet<Usuario> Usuarios { get; set; }
        // Añadir más DbSet para otras tablas que necesites
    }
}
