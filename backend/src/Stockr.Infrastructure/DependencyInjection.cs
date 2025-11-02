using Microsoft.Extensions.DependencyInjection;
using Stockr.Application.Auth.Abstractions;
using Stockr.Application.Stocks.Abstractions;
using Stockr.Infrastructure.Authentication;
using Stockr.Infrastructure.Stocks;

namespace Stockr.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IUserCredentialValidator, HardCodedCredentialValidator>();
        
        // Add HttpClient for stock price service
        services.AddHttpClient<IStockPriceService, FinnhubStockPriceService>();

        return services;
    }
}

