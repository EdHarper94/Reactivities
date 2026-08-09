using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Commands;

public class UpdateAttendance
{
    public class Command : IRequest<Result<Unit>>
    {
        public required string Id { get; set; }
    }

    public class Handler(IUserAccessor userAccessor, AppDBContext context) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            return await context.Activities
                .Include(x => x.Attendees)
                .ThenInclude(x => x.User)
                .FindOrFailAsync(x => x.Id == request.Id, cancellationToken)
                .BindAsync(async entity =>
                {
                    var user = await userAccessor.GetUserAsync();

                    var attendance = entity.Attendees.FirstOrDefault(x => x.UserId == user.Id);

                    var isHost = entity.Attendees.Any(x => x.IsHost && x.UserId == user.Id);

                    if(attendance != null)
                    {
                        if(isHost) entity.IsCancelled = !entity.IsCancelled;
                        else entity.Attendees.Remove(attendance);
                    }
                    else
                    {
                        entity.Attendees.Add(new Domain.ActivityAttendee
                        {
                            UserId = user.Id,
                            ActivityId = entity.Id,
                            IsHost = false
                        });
                    }

                    await context.SaveChangesAsync(cancellationToken);
                    return Result<Unit>.Success(Unit.Value);
                });
        }
    }
}