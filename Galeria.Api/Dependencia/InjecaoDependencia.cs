using Galeria.Application.Interfaces;
using Galeria.Application.Services;
using Galeria.Domain.Interfaces;
using Galeria.Infrastructure.Context;
using Galeria.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;

namespace Galeria.Api.Dependencia
{
    public static class InjecaoDependencia
    {
        public static void RegisterServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddHttpContextAccessor();
            services.AddDbContext<DataContext>(options =>
            {
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
#if DESENVOLVIMENTO
                            options.EnableSensitiveDataLogging().LogTo(Console.WriteLine, LogLevel.Information).EnableDetailedErrors();
#endif
            });

            services.AddScoped(typeof(IRepositoryBase<>), typeof(RepositoryBase<>));
            services.AddScoped<IUnitOfWork>(provider => provider.GetRequiredService<DataContext>());
            services.AddScoped<IClienteRepository, ClienteRepository>();
            services.AddScoped<IClienteServices, ClienteServices>();
            services.AddScoped<IGaleriaServices, GaleriaServices>();
            services.AddScoped<IGaleriaRepository, GaleriaRepository>();
            services.AddScoped<IGaleriaSecaoRepository, GaleriaSecaoRepository>();
            services.AddScoped<ISecaoServices, SecaoServices>();
            services.AddScoped<IGaleriaImagemServices, GaleriaImagemServices>();
            services.AddScoped<IGaleriaImagemRepository, GaleriaImagemRepository>();
        }
    }
}
