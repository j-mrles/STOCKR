using System;
using System.Threading;
using System.Threading.Tasks;
using Stockr.Application.Auth.Abstractions;

namespace Stockr.Infrastructure.Authentication;

public sealed class HardCodedCredentialValidator : IUserCredentialValidator
{
    private const string AllowedUsername = "jmrles";
    private const string AllowedPassword = "123";

    public Task<bool> ValidateAsync(
        string username,
        string password,
        CancellationToken cancellationToken = default)
    {
        var matches = string.Equals(username, AllowedUsername, StringComparison.OrdinalIgnoreCase)
            && password == AllowedPassword;

        return Task.FromResult(matches);
    }
}

