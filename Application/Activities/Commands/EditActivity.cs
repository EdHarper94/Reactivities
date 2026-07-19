
using Application.Activities.DTOs;
using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities.Commands;

public class EditActivity
{
    public class Command : IRequest<Result<Unit>>
    {
        public required EditActivityDTO ActivityDTO { get; set; }
    }

    public class Handler(AppDBContext context, IMapper mapper) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            => await context.Activities
                .FindOrFailAsync(request.ActivityDTO.Id, cancellationToken)
                .BindAsync(async entity =>
                {
                    mapper.Map(request.ActivityDTO, entity);

                    await context.SaveChangesAsync(cancellationToken);

                    return Result<Unit>.Success(Unit.Value); 
                });
    }
}
