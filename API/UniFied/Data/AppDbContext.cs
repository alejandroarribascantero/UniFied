using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using UniFied.Models;

namespace UniFied.Data;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<ConexionesUsuario> ConexionesUsuarios { get; set; }

    public virtual DbSet<Facultad> Facultads { get; set; }

    public virtual DbSet<Pregunta> Preguntas { get; set; }

    public virtual DbSet<RespuestasTest> RespuestasTests { get; set; }

    public virtual DbSet<TipoPersonalidad> TipoPersonalidads { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }


    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySQL("server=localhost;port=3306;database=UniFied;user=root;password=1234");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ConexionesUsuario>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("conexiones_usuario");

            entity.HasIndex(e => new { e.UsuarioId1, e.UsuarioId2 }, "USUARIO_ID_1").IsUnique();

            entity.HasIndex(e => e.UsuarioId2, "USUARIO_ID_2");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Estado)
                .HasDefaultValueSql("'pendiente'")
                .HasColumnType("enum('pendiente','aceptada','rechazada','bloqueada')")
                .HasColumnName("ESTADO");
            entity.Property(e => e.FechaSolicitud)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("FECHA_SOLICITUD");
            entity.Property(e => e.UsuarioId1).HasColumnName("USUARIO_ID_1");
            entity.Property(e => e.UsuarioId2).HasColumnName("USUARIO_ID_2");

            entity.HasOne(d => d.UsuarioId1Navigation).WithMany(p => p.ConexionesUsuarioUsuarioId1Navigations)
                .HasForeignKey(d => d.UsuarioId1)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("conexiones_usuario_ibfk_1");

            entity.HasOne(d => d.UsuarioId2Navigation).WithMany(p => p.ConexionesUsuarioUsuarioId2Navigations)
                .HasForeignKey(d => d.UsuarioId2)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("conexiones_usuario_ibfk_2");
        });

        modelBuilder.Entity<Facultad>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("facultad");

            entity.HasIndex(e => e.Nombre, "NOMBRE").IsUnique();

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Nombre).HasColumnName("NOMBRE");
        });

        modelBuilder.Entity<Pregunta>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("preguntas");

            entity.HasIndex(e => e.PersonalidadA, "PERSONALIDAD_A");

            entity.HasIndex(e => e.PersonalidadB, "PERSONALIDAD_B");

            entity.HasIndex(e => e.PersonalidadC, "PERSONALIDAD_C");

            entity.HasIndex(e => e.PersonalidadD, "PERSONALIDAD_D");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.OpcionA)
                .HasMaxLength(200)
                .HasColumnName("OPCION_A");
            entity.Property(e => e.OpcionB)
                .HasMaxLength(200)
                .HasColumnName("OPCION_B");
            entity.Property(e => e.OpcionC)
                .HasMaxLength(200)
                .HasColumnName("OPCION_C");
            entity.Property(e => e.OpcionD)
                .HasMaxLength(200)
                .HasColumnName("OPCION_D");
            entity.Property(e => e.PersonalidadA).HasColumnName("PERSONALIDAD_A");
            entity.Property(e => e.PersonalidadB).HasColumnName("PERSONALIDAD_B");
            entity.Property(e => e.PersonalidadC).HasColumnName("PERSONALIDAD_C");
            entity.Property(e => e.PersonalidadD).HasColumnName("PERSONALIDAD_D");
            entity.Property(e => e.Pregunta1)
                .HasMaxLength(200)
                .HasColumnName("PREGUNTA");

            entity.HasOne(d => d.PersonalidadANavigation).WithMany(p => p.PreguntaPersonalidadANavigations)
                .HasForeignKey(d => d.PersonalidadA)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("preguntas_ibfk_1");

            entity.HasOne(d => d.PersonalidadBNavigation).WithMany(p => p.PreguntaPersonalidadBNavigations)
                .HasForeignKey(d => d.PersonalidadB)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("preguntas_ibfk_2");

            entity.HasOne(d => d.PersonalidadCNavigation).WithMany(p => p.PreguntaPersonalidadCNavigations)
                .HasForeignKey(d => d.PersonalidadC)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("preguntas_ibfk_3");

            entity.HasOne(d => d.PersonalidadDNavigation).WithMany(p => p.PreguntaPersonalidadDNavigations)
                .HasForeignKey(d => d.PersonalidadD)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("preguntas_ibfk_4");
        });

        modelBuilder.Entity<RespuestasTest>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("respuestas_test");

            entity.HasIndex(e => e.PreguntaId, "PREGUNTA_ID");

            entity.HasIndex(e => e.UsuarioId, "USUARIO_ID");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.FechaRespuesta)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("FECHA_RESPUESTA");
            entity.Property(e => e.OpcionElegida)
                .HasMaxLength(1)
                .IsFixedLength()
                .HasColumnName("OPCION_ELEGIDA");
            entity.Property(e => e.PreguntaId).HasColumnName("PREGUNTA_ID");
            entity.Property(e => e.UsuarioId).HasColumnName("USUARIO_ID");

            entity.HasOne(d => d.Pregunta).WithMany(p => p.RespuestasTests)
                .HasForeignKey(d => d.PreguntaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("respuestas_test_ibfk_2");

            entity.HasOne(d => d.Usuario).WithMany(p => p.RespuestasTests)
                .HasForeignKey(d => d.UsuarioId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("respuestas_test_ibfk_1");
        });

        modelBuilder.Entity<TipoPersonalidad>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("tipo_personalidad");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CodigoMbti)
                .HasMaxLength(4)
                .IsFixedLength()
                .HasColumnName("CODIGO_MBTI");
            entity.Property(e => e.Descripcion)
                .HasColumnType("text")
                .HasColumnName("DESCRIPCION");
            entity.Property(e => e.Estrategia)
                .HasMaxLength(50)
                .HasColumnName("ESTRATEGIA");
            entity.Property(e => e.Nombre)
                .HasMaxLength(50)
                .HasColumnName("NOMBRE");
            entity.Property(e => e.Rol)
                .HasMaxLength(50)
                .HasColumnName("ROL");
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("usuario");

            entity.HasIndex(e => e.FacultadId, "FACULTAD_ID");

            entity.HasIndex(e => e.TipoPersonalidadId, "TIPO_PERSONALIDAD_ID");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Apellido1)
                .HasMaxLength(255)
                .HasColumnName("APELLIDO1");
            entity.Property(e => e.Apellido2)
                .HasMaxLength(255)
                .HasColumnName("APELLIDO2");
            entity.Property(e => e.Contrasena)
                .HasMaxLength(255)
                .HasColumnName("CONTRASENA");
            entity.Property(e => e.Correo)
                .HasMaxLength(255)
                .HasColumnName("CORREO");
            entity.Property(e => e.Curso)
                .HasPrecision(2)
                .HasColumnName("CURSO");
            entity.Property(e => e.FacultadId).HasColumnName("FACULTAD_ID");
            entity.Property(e => e.FechaNacimiento)
                .HasColumnType("date")
                .HasColumnName("FECHA_NACIMIENTO");
            entity.Property(e => e.ImagenPerfil)
                .HasMaxLength(500)
                .HasDefaultValueSql("'/assets/default.jpg'")
                .HasColumnName("IMAGEN_PERFIL");
            entity.Property(e => e.Nombre)
                .HasMaxLength(255)
                .HasColumnName("NOMBRE");
            entity.Property(e => e.TipoPersonalidadId).HasColumnName("TIPO_PERSONALIDAD_ID");

            entity.HasOne(d => d.Facultad).WithMany(p => p.Usuarios)
                .HasForeignKey(d => d.FacultadId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("usuario_ibfk_2");

            entity.HasOne(d => d.TipoPersonalidad).WithMany(p => p.Usuarios)
                .HasForeignKey(d => d.TipoPersonalidadId)
                .HasConstraintName("usuario_ibfk_1");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
