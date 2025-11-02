namespace Stockr.Application.Auth.Login;

public sealed record LoginResult(bool IsAuthenticated, string? Token, string? Message);

