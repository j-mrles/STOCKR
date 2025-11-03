using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Stockr.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NewsController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly string _pythonServiceUrl;

    public NewsController(IHttpClientFactory httpClientFactory)
    {
        _httpClient = httpClientFactory.CreateClient() ?? throw new ArgumentNullException(nameof(httpClientFactory));
        _pythonServiceUrl = "http://localhost:8000";
    }

    /// <summary>
    /// Gets latest financial news articles
    /// </summary>
    /// <param name="limit">Maximum number of articles to return (default: 20)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of news articles</returns>
    [HttpGet]
    [ProducesResponseType(typeof(NewsResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<NewsResponse>> GetLatestNews(
        [FromQuery] int limit = 20,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await _httpClient.GetFromJsonAsync<NewsResponse>(
                $"{_pythonServiceUrl}/news?limit={limit}",
                cancellationToken);

            if (response is null)
            {
                return Ok(new NewsResponse("success", 0, new List<NewsArticleDto>()));
            }

            return Ok(response);
        }
        catch (Exception)
        {
            return Ok(new NewsResponse("success", 0, new List<NewsArticleDto>()));
        }
    }

    public record NewsResponse(
        [property: JsonPropertyName("status")] string Status,
        [property: JsonPropertyName("count")] int Count,
        [property: JsonPropertyName("articles")] List<NewsArticleDto> Articles
    );

    public record NewsArticleDto(
        [property: JsonPropertyName("title")] string Title,
        [property: JsonPropertyName("summary")] string Summary,
        [property: JsonPropertyName("source")] string Source,
        [property: JsonPropertyName("timestamp")] string Timestamp,
        [property: JsonPropertyName("url")] string Url,
        [property: JsonPropertyName("scraped_at")] string ScrapedAt
    );
}

