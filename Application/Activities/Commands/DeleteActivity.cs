using Application.Core;
using MediatR;
using Persistence;

namespace Application.Activities.Commands;
public class DeleteActivity
{
    public class Command : IRequest<Result<Unit>>
    {
        public required string Id { get; set; }
    }

    public class Handler(AppDBContext context) : IRequestHandler<Command, Result<Unit>>
    {
        public Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            => context.Activities
                .FindOrFailAsync(request.Id, cancellationToken)
                .BindAsync(async entity =>
                {
                    context.Activities.Remove(entity);
                    await context.SaveChangesAsync(cancellationToken);
                    return Result<Unit>.Success(Unit.Value);
                });
    }
}
