using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Stockr.Api.Contracts.Auth;
using Stockr.Application.Auth.Login;
using Stockr.Application.Common.Cqrs;

namespace Stockr.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ICommandDispatcher _commandDispatcher;

    public AuthController(ICommandDispatcher commandDispatcher)
    {
        _commandDispatcher = commandDispatcher ?? throw new ArgumentNullException(nameof(commandDispatcher));
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(
        [FromBody] LoginRequest request,
        CancellationToken cancellationToken)
    {
        if (request is null)
        {
            return BadRequest(new LoginResponse(false, null, "Request payload is required."));
        }

        var command = new LoginCommand(request.Username, request.Password);

        var result = await _commandDispatcher.DispatchAsync<LoginCommand, LoginResult>(
            command,
            cancellationToken);

        if (!result.IsAuthenticated)
        {
            return Unauthorized(new LoginResponse(false, null, result.Message ?? "Invalid credentials."));
        }

        return Ok(new LoginResponse(true, result.Token, null));
    }
}

