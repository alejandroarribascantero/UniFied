using Dapper;
using MySqlConnector;

namespace API_UniFied;
public class Database
{
    private readonly string _connectionString;

    public Database(string connectionString)
    {
        _connectionString = connectionString;
    }

    // Método genérico para ejecutar consultas
    public async Task<IEnumerable<T>> Consulta<T>(string sql, object parameters = null)
    {
        using (var connection = new MySqlConnection(_connectionString))
        {
            await connection.OpenAsync();
            return await connection.QueryAsync<T>(sql, parameters);
        }
    }

    // Método para ejecutar un comando de actualización, inserción, eliminación
    public async Task<int> Insertar(string sql, object parameters = null)
    {
        using (var connection = new MySqlConnection(_connectionString))
        {
            await connection.OpenAsync();
            
            // Si la consulta contiene SELECT LAST_INSERT_ID(), usamos QuerySingleAsync
            if (sql.Contains("SELECT LAST_INSERT_ID()"))
            {
                return await connection.QuerySingleAsync<int>(sql, parameters);
            }
            // En caso contrario, usamos ExecuteAsync
            else
            {
                return await connection.ExecuteAsync(sql, parameters);
            }
        }
    }
}
