using Application.Core;
using Application.Interfaces;
using Application.Profiles.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles.Queries;

public class GetFollowings
{
    public class Query : IRequest<Result<List<UserProfileDTO>>>
    {
        public string Predicate { get; set; } = "followers";
        public required string UserId { get; set; }
    }

    public class Handler(AppDBContext context, IMapper mapper, IUserAccessor userAccessor) : IRequestHandler<Query, Result<List<UserProfileDTO>>>
    {
        public async Task<Result<List<UserProfileDTO>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var profiles = new List<UserProfileDTO>();

            switch (request.Predicate)
            {
                case "followers":
                    profiles = await context.UserFollowings.Where(x => x.Target.Id == request.UserId)
                        .Select(x => x.Observer)
                        .ProjectTo<UserProfileDTO>(mapper.ConfigurationProvider, 
                            new { currentUserId = userAccessor.GetUserId() })
                        .ToListAsync(cancellationToken);
                    break;
                case "followings":
                    profiles = await context.UserFollowings.Where(x => x.Observer.Id == request.UserId)
                        .Select(x => x.Target)
                        .ProjectTo<UserProfileDTO>(mapper.ConfigurationProvider, 
                            new { currentUserId = userAccessor.GetUserId() })
                        .ToListAsync(cancellationToken);
                    break;
            }

            return Result<List<UserProfileDTO>>.Success(profiles);
        }
    }
}