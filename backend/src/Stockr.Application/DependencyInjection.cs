using Microsoft.Extensions.DependencyInjection;
using Stockr.Application.Auth.Login;
using Stockr.Application.Common.Cqrs;

namespace Stockr.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<ICommandDispatcher, CommandDispatcher>();
        services.AddScoped<ICommandHandler<LoginCommand, LoginResult>, LoginCommandHandler>();

        return services;
    }
}

