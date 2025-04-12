using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using UniFied.Data;
using UniFied.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Configurar Entity Framework Core
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySQL(builder.Configuration.GetConnectionString("DefaultConnection")));

// Agregar servicios de Swagger
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "UniFied API",
        Version = "v1",
        Description = "API para gestionar la información de la aplicación UniFied."
    });
});

builder.Services.AddScoped<TestService>();
builder.Services.AddScoped<ConexionService>();
builder.Services.AddScoped<AuthService>();

var app = builder.Build();

// Habilitar Swagger en el entorno de desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Mi API v1");
        c.RoutePrefix = string.Empty;  
    });
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

