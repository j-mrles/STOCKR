namespace Stockr.Api.Contracts.Auth;

public sealed record LoginResponse(bool IsAuthenticated, string? Token, string? Message);

