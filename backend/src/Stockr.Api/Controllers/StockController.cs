using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Stockr.Application.Stocks.Abstractions;

namespace Stockr.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StockController : ControllerBase
{
    private readonly IStockPriceService _stockPriceService;

    public StockController(IStockPriceService stockPriceService)
    {
        _stockPriceService = stockPriceService ?? throw new ArgumentNullException(nameof(stockPriceService));
    }

    /// <summary>
    /// Gets real-time quote for a single stock symbol
    /// </summary>
    /// <param name="symbol">Stock symbol (e.g., AAPL, NVDA)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Stock price information</returns>
    [HttpGet("{symbol}")]
    [ProducesResponseType(typeof(StockPriceDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<StockPriceDto>> GetQuote(
        string symbol,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(symbol))
        {
            return BadRequest("Symbol cannot be empty");
        }

        var quote = await _stockPriceService.GetQuoteAsync(symbol, cancellationToken);

        if (quote is null)
        {
            return NotFound($"Quote not found for symbol: {symbol}");
        }

        return Ok(quote);
    }

    /// <summary>
    /// Gets real-time quotes for multiple stock symbols
    /// </summary>
    /// <param name="symbols">Comma-separated stock symbols (e.g., AAPL,NVDA,TSLA)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of stock price information</returns>
    [HttpGet("multiple")]
    [ProducesResponseType(typeof(IEnumerable<StockPriceDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<StockPriceDto>>> GetMultipleQuotes(
        [FromQuery] string symbols,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(symbols))
        {
            return BadRequest("Symbols cannot be empty");
        }

        var symbolList = symbols.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        var quotes = await _stockPriceService.GetMultipleQuotesAsync(symbolList, cancellationToken);

        return Ok(quotes);
    }
}

