namespace API_UniFied
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Agregar la cadena de conexión a la configuración
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

            // Registrar el servicio Database
            builder.Services.AddSingleton(new Database(connectionString));

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
