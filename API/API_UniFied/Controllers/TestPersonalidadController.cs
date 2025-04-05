using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using API_UniFied.Models;

namespace API_UniFied.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestPersonalidadController : ControllerBase
    {
        private readonly Database _database;

        public TestPersonalidadController(Database database)
        {
            _database = database;
        }

        [HttpGet("preguntas")]
        public async Task<ActionResult<IEnumerable<PreguntaTest>>> GetPreguntas()
        {
            try
            {
                string sql = @"
                    SELECT 
                        id as Id,
                        pregunta as Pregunta,
                        opcion_a as OpcionA,
                        opcion_b as OpcionB,
                        opcion_c as OpcionC,
                        opcion_d as OpcionD,
                        eneatipo_a as EneatipoA,
                        eneatipo_b as EneatipoB,
                        eneatipo_c as EneatipoC,
                        eneatipo_d as EneatipoD
                    FROM Preguntas";
                
                var preguntas = await _database.Consulta<PreguntaTest>(sql);
                return Ok(preguntas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpPost("respuestas")]
        public async Task<ActionResult> GuardarRespuestas([FromBody] RespuestasTest respuestas)
        {
            try
            {
                // Obtener el ID del usuario actual
                var usuario = await _database.Consulta<Usuario>(
                    "SELECT id FROM Usuario WHERE Email = @Email",
                    new { Email = respuestas.Email }
                );

                if (!usuario.Any())
                {
                    return NotFound("Usuario no encontrado");
                }

                int usuarioId = usuario.First().id;

                // Guardar las respuestas
                string sql = @"
                    INSERT INTO Respuestas (fk_usuario, fk_pregunta, respuesta)
                    VALUES (@UsuarioId, @PreguntaId, @Respuesta)";

                foreach (var respuesta in respuestas.Respuestas)
                {
                    await _database.Insertar(sql, new
                    {
                        UsuarioId = usuarioId,
                        PreguntaId = respuesta.PreguntaId,
                        Respuesta = respuesta._Respuesta
                    });
                }

                // Calcular el eneatipo
                int eneatipo = await CalcularEneatipo(usuarioId);

                // Actualizar el eneatipo del alumno
                await _database.Insertar(
                    "UPDATE Alumno SET eneatipo = @Eneatipo WHERE fk_usuario = @UsuarioId",
                    new { Eneatipo = eneatipo, UsuarioId = usuarioId }
                );

                return Ok(new { eneatipo = eneatipo });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        private async Task<int> CalcularEneatipo(int usuarioId)
        {
            // Obtener todas las respuestas del usuario
            string sql = @"
                SELECT r.respuesta, p.eneatipo_a, p.eneatipo_b, p.eneatipo_c, p.eneatipo_d
                FROM Respuestas r
                JOIN Preguntas p ON r.fk_pregunta = p.id
                WHERE r.fk_usuario = @UsuarioId";

            var respuestas = await _database.Consulta<dynamic>(sql, new { UsuarioId = usuarioId });

            // Contador para cada eneatipo
            int[] contadorEneatipos = new int[9]; // 9 eneatipos posibles

            foreach (var respuesta in respuestas)
            {
                // Determinar qué eneatipo corresponde a la respuesta
                int eneatipo = respuesta.respuesta switch
                {
                    "A" => respuesta.eneatipo_a,
                    "B" => respuesta.eneatipo_b,
                    "C" => respuesta.eneatipo_c,
                    "D" => respuesta.eneatipo_d,
                    _ => 0
                };

                if (eneatipo > 0)
                {
                    contadorEneatipos[eneatipo - 1]++;
                }
            }

            // Encontrar el eneatipo con más respuestas
            int maxEneatipo = 0;
            int maxCount = 0;

            for (int i = 0; i < contadorEneatipos.Length; i++)
            {
                if (contadorEneatipos[i] > maxCount)
                {
                    maxCount = contadorEneatipos[i];
                    maxEneatipo = i + 1;
                }
            }

            return maxEneatipo;
        }
    }

    public class Respuesta
    {
        public int PreguntaId { get; set; }
        public string _Respuesta { get; set; }
    }

    public class RespuestasTest
    {
        public string Email { get; set; }
        public List<Respuesta> Respuestas { get; set; }
    }
} 