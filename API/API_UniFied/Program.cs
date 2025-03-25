using Microsoft.EntityFrameworkCore;

namespace API_UniFied
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddDbContext<AppDbContext>(options => options.UseMySql(
                builder.Configuration.GetConnectionString("DefaultConnection"), // Cadena de conexión
                new MySqlServerVersion(new Version(8, 0, 23)) // Versión de MySQL (ajusta esto según la versión de tu MySQL)
    )
);
            // Add services to the container.

            builder.Services.AddControllers();

            var app = builder.Build();

            // Configure the HTTP request pipeline.

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
