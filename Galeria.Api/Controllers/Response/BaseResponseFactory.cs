namespace Galeria.Api.Controllers.Response;

public static class BaseResponseFactory
{
    public static BaseResponse<T> Success<T>(T data, string? message = null)
        => new(true, data, message, StatusCodes.Status200OK);

    public static BaseResponse<object?> Success(string? message = null)
        => new(true, null, message, StatusCodes.Status200OK);

    public static BaseResponse<object?> Failure(string message, int statusCode)
        => new(false, null, message, statusCode);
}
