using System;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Persistence;

namespace Application.Profiles.Commands;

public class DeletePhoto
{
    public class Command : IRequest<Result<Unit>>
    {
        public required string PhotoId { get; set; }
    }

    public class Handler(AppDBContext context, IUserAccessor userAccessor, IPhotoService photoService)
        : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await userAccessor.GetUserWithPhotosAsync();

            return await context.Photos
                .FindOrFailAsync(x => x.Id == request.PhotoId && x.UserId == user.Id, cancellationToken)
                .BindAsync(async photo =>
                {
                    if (photo.Url == user.ImageUrl)
                        return Result<Unit>.Failure("You cannot delete your main photo", 400);

                    await photoService.DeletePhoto(photo.PublicId);

                    user.Photos.Remove(photo);

                    var result = await context.SaveChangesAsync(cancellationToken) > 0;

                    return result
                        ? Result<Unit>.Success(Unit.Value)
                        : Result<Unit>.Failure("Problem deleting photo", 400);
                });
        }
    }
}
