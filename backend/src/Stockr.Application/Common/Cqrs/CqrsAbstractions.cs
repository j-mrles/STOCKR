using System;
using System.Threading;
using System.Threading.Tasks;

namespace Stockr.Application.Common.Cqrs;

public interface ICommand<TResult>;

public interface ICommandHandler<in TCommand, TResult>
    where TCommand : ICommand<TResult>
{
    Task<TResult> HandleAsync(TCommand command, CancellationToken cancellationToken = default);
}

public interface ICommandDispatcher
{
    Task<TResult> DispatchAsync<TCommand, TResult>(
        TCommand command,
        CancellationToken cancellationToken = default)
        where TCommand : ICommand<TResult>;
}

public sealed class CommandDispatcher : ICommandDispatcher
{
    private readonly IServiceProvider _serviceProvider;

    public CommandDispatcher(IServiceProvider serviceProvider)
    {
        ArgumentNullException.ThrowIfNull(serviceProvider);
        _serviceProvider = serviceProvider;
    }

    public Task<TResult> DispatchAsync<TCommand, TResult>(
        TCommand command,
        CancellationToken cancellationToken = default)
        where TCommand : ICommand<TResult>
    {
        ArgumentNullException.ThrowIfNull(command);

        var handler = _serviceProvider.GetService(typeof(ICommandHandler<TCommand, TResult>))
            as ICommandHandler<TCommand, TResult>;

        if (handler is null)
        {
            throw new InvalidOperationException($"No handler registered for command {typeof(TCommand).Name}.");
        }

        return handler.HandleAsync(command, cancellationToken);
    }
}

