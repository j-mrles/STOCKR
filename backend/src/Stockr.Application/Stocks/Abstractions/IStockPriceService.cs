using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Stockr.Application.Stocks.Abstractions;

public interface IStockPriceService
{
    Task<StockPriceDto?> GetQuoteAsync(string symbol, CancellationToken cancellationToken = default);
    Task<IEnumerable<StockPriceDto>> GetMultipleQuotesAsync(IEnumerable<string> symbols, CancellationToken cancellationToken = default);
}

public record StockPriceDto(
    string Symbol,
    double CurrentPrice,
    double OpenPrice,
    double HighPrice,
    double LowPrice,
    double PreviousClose,
    long Volume,
    long Timestamp
);

