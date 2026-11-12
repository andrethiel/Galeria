using Galeria.Application.Exceptions;
using System.Text.Json;

namespace Galeria.Api.Middleware;

public sealed class ExceptionHandlingMiddleware(RequestDelegate _next,ILogger<ExceptionHandlingMiddleware> _logger)
{
    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ServicesException nfex)
        {
            _logger.LogWarning(nfex, nfex.Message);
            await HandleExceptionAsync(context, nfex.Message, 404);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro não tratado: {Message}", ex.Message);
            await HandleExceptionAsync(
                context,
                "Erro interno ao processar a solicitação.",
                StatusCodes.Status500InternalServerError);
        }
    }

    private Task HandleExceptionAsync(HttpContext context, string message, int statusCode)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = statusCode;

        var response = new
        {
            success = false,
            message,
            statusCode
        };

        return context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}
