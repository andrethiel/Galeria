using Amazon.S3;
using FluentValidation.AspNetCore;
using Galeria.Api.Dependencia;
using Galeria.Api.Extensions;
using Galeria.Application.DTOs;
using Galeria.Application.Interfaces;
using Galeria.Application.Services;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();

builder.Services.Configure<CloudflareR2Settings>(
    builder.Configuration.GetSection("CloudflareR2"));

builder.Services.AddSingleton<IAmazonS3>(sp =>
{
    var settings = sp.GetRequiredService<
        IOptions<CloudflareR2Settings>>().Value;

    var config = new AmazonS3Config
    {
        ServiceURL =
            $"https://{settings.AccountId}.r2.cloudflarestorage.com",

        AuthenticationRegion = "auto",
        ForcePathStyle = true
    };

    return new AmazonS3Client(
        settings.AccessKeyId,
        settings.SecretAccessKey,
        config
    );
});

builder.Services.AddScoped<IR2StorageService, R2StorageService>();

builder.Services.AddControllers();
builder.Services.AddProblemDetails();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddMemoryCache();
builder.Services.AddAuthorization();

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("api", context => RateLimitPartition.GetFixedWindowLimiter(
        context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
        _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 100,
            Window = TimeSpan.FromMinutes(1),
            QueueLimit = 0,
            AutoReplenishment = true
        }));
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        var origins = builder.Configuration
            .GetSection("Cors:Origins")
            .GetChildren()
            .Select(section => section.Value)
            .OfType<string>()
            .Where(origin => !string.IsNullOrWhiteSpace(origin))
            .ToArray();

        if (origins.Length > 0)
        {
            policy.WithOrigins(origins);
        }

        policy.AllowAnyHeader().AllowAnyMethod();
    });
});

builder.Services.RegisterServices(builder.Configuration);


var app = builder.Build();
var imagensPath = Path.Combine(Directory.GetCurrentDirectory(), "Imagens");
Directory.CreateDirectory(imagensPath);

if (app.Environment.IsDevelopment() || app.Environment.IsStaging())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHsts();
}

app.UseCustomExceptionMiddleware();
app.UseHttpsRedirection();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(imagensPath),
    RequestPath = "/Imagens"
});
app.UseRouting();
app.UseCors("AllowFrontend");
app.UseRateLimiter();
app.UseAuthorization();
app.MapControllers().RequireRateLimiting("api");

app.Run();
