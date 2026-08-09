using System;

using Application.Core;
using Application.Interfaces;
using MediatR;
using Persistence;

namespace Application.Profiles.Commands;

public class SetMainPhoto
{
    public class Command : IRequest<Result<Unit>>
    {
        public required string Id { get; set; }
    }

    public class Handler(AppDBContext context, IUserAccessor userAccessor) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await userAccessor.GetUserWithPhotosAsync();

            return await context.Photos
                .FindOrFailAsync(x => x.Id == request.Id && x.UserId == user.Id, cancellationToken)
                .BindAsync(async photo =>
                {
                    user.ImageUrl = photo.Url;

                    var result = await context.SaveChangesAsync(cancellationToken) > 0;

                    return result
                        ? Result<Unit>.Success(Unit.Value)
                        : Result<Unit>.Failure("Problem setting main photo", 400);
                });
        }
    }
}
