using Microsoft.Extensions.DependencyInjection;
using Stockr.Application.Auth.Abstractions;
using Stockr.Infrastructure.Authentication;

namespace Stockr.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IUserCredentialValidator, HardCodedCredentialValidator>();

        return services;
    }
}

