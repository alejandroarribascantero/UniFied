using UniFied.DTOs;
using UniFied.Data;
using UniFied.Models; 

namespace UniFied.Services;

public class TestService{

    private readonly AppDbContext _context;

    public TestService(AppDbContext context)
    {
        _context = context;
    }

    public List<PreguntaDTO> ObtenerPreguntas()
    {
        return _context.Preguntas.Select(p => new PreguntaDTO
        {
            Id = p.Id,
            Pregunta = p.Pregunta1,
            Opciones = new List<string> { p.OpcionA, p.OpcionB, p.OpcionC, p.OpcionD }
        }).ToList();
    }

    public void ResolverTest(TestRespuestasUsuarioDTO test)
    {
        bool yaRespondio = _context.RespuestasTests.Any(r => r.UsuarioId == test.UsuarioId);
        
        if (yaRespondio)
            throw new InvalidOperationException("Este usuario ya ha realizado el test de personalidad.");
        
        var contador = new Dictionary<int, int>();

        foreach (var respuesta in test.Respuestas)
        {
            var pregunta = _context.Preguntas.Find(respuesta.PreguntaId);
            int personalidadId = respuesta.OpcionElegida switch
            {
                'A' => pregunta.PersonalidadA,
                'B' => pregunta.PersonalidadB,
                'C' => pregunta.PersonalidadC,
                'D' => pregunta.PersonalidadD,
                _ => throw new Exception("Opción no válida")
            };

            if (!contador.ContainsKey(personalidadId))
                contador[personalidadId] = 0;

            contador[personalidadId]++;

            var respuestaTest = new RespuestasTest
            {
                UsuarioId = test.UsuarioId,
                PreguntaId = respuesta.PreguntaId,
                OpcionElegida = respuesta.OpcionElegida.ToString()
            };
            _context.RespuestasTests.Add(respuestaTest);
        }

        int idGanador = contador.OrderByDescending(c => c.Value).First().Key;

        var usuario = _context.Usuarios.Find(test.UsuarioId);
        usuario.TipoPersonalidadId = idGanador;

        _context.SaveChanges();
    }
}