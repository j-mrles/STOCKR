using System.Threading;
using System.Threading.Tasks;

namespace Stockr.Application.Auth.Abstractions;

public interface IUserCredentialValidator
{
    Task<bool> ValidateAsync(string username, string password, CancellationToken cancellationToken = default);
}

