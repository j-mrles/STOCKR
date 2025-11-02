using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Stockr.Application.Stocks.Abstractions;

namespace Stockr.Infrastructure.Stocks;

public class FinnhubStockPriceService : IStockPriceService
{
    private readonly HttpClient _httpClient;
    private readonly string _pythonServiceUrl;

    public FinnhubStockPriceService(HttpClient httpClient)
    {
        _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        _pythonServiceUrl = "http://localhost:8000";
    }

    public async Task<StockPriceDto?> GetQuoteAsync(string symbol, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(symbol))
            return null;

        try
        {
            return await GetPriceFromPythonService(symbol.ToUpper());
        }
        catch (Exception)
        {
            // Return null if scraping fails - frontend will display N/A
            return null;
        }
    }

    private async Task<StockPriceDto?> GetPriceFromPythonService(string symbol)
    {
        try
        {
            var response = await _httpClient.GetFromJsonAsync<PythonStockResponse>(
                $"{_pythonServiceUrl}/stock/{symbol}",
                cancellationToken: default);

            if (response == null || response.Status != "success" || !response.Price.HasValue)
                return null;

            return new StockPriceDto(
                Symbol: symbol,
                CurrentPrice: response.Price.Value,
                OpenPrice: response.Price.Value,
                HighPrice: response.Price.Value,
                LowPrice: response.Price.Value,
                PreviousClose: response.Price.Value,
                Volume: 0,
                Timestamp: DateTimeOffset.UtcNow.ToUnixTimeSeconds()
            );
        }
        catch
        {
            return null;
        }
    }

    public async Task<IEnumerable<StockPriceDto>> GetMultipleQuotesAsync(
        IEnumerable<string> symbols,
        CancellationToken cancellationToken = default)
    {
        if (symbols is null || !symbols.Any())
            return Enumerable.Empty<StockPriceDto>();

        var tasks = symbols.Select(symbol => GetQuoteAsync(symbol, cancellationToken));
        var results = await Task.WhenAll(tasks);

        return results.Where(dto => dto is not null)!;
    }

    private record PythonStockResponse(
        [property: JsonPropertyName("symbol")] string Symbol,
        [property: JsonPropertyName("price")] double? Price,
        [property: JsonPropertyName("status")] string Status,
        [property: JsonPropertyName("message")] string? Message
    );
}
