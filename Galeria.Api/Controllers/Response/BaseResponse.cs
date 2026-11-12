namespace Galeria.Api.Controllers.Response;

public sealed record BaseResponse<T>(
    bool Success,
    T? Data = default,
    string? Message = null,
    int StatusCode = StatusCodes.Status200OK);
