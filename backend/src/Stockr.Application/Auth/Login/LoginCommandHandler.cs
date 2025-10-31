using System;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Stockr.Application.Auth.Abstractions;
using Stockr.Application.Common.Cqrs;

namespace Stockr.Application.Auth.Login;

public sealed class LoginCommandHandler : ICommandHandler<LoginCommand, LoginResult>
{
    private readonly IUserCredentialValidator _credentialValidator;

    public LoginCommandHandler(IUserCredentialValidator credentialValidator)
    {
        ArgumentNullException.ThrowIfNull(credentialValidator);
        _credentialValidator = credentialValidator;
    }

    public async Task<LoginResult> HandleAsync(
        LoginCommand command,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(command);

        var isValid = await _credentialValidator.ValidateAsync(
            command.Username,
            command.Password,
            cancellationToken);

        if (!isValid)
        {
            return new LoginResult(false, null, "Invalid credentials.");
        }

        var token = GenerateFakeToken(command.Username);
        return new LoginResult(true, token, null);
    }

    private static string GenerateFakeToken(string username)
    {
        var rawToken = $"{username}:{DateTime.UtcNow:O}";
        return Convert.ToBase64String(Encoding.UTF8.GetBytes(rawToken));
    }
}

