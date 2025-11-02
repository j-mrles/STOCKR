using Stockr.Application.Common.Cqrs;

namespace Stockr.Application.Auth.Login;

public sealed record LoginCommand(string Username, string Password) : ICommand<LoginResult>;

