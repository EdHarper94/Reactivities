using Application.Core;
using Application.Interfaces;
using Application.Profiles.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles.Queries;

public class GetProfile
{
    public class Query : IRequest<Result<UserProfileDTO>>
    {
        public required string Id { get; set; }
    }

    public class Handler(AppDBContext context, IMapper mapper, IUserAccessor userAccessor) : IRequestHandler<Query, Result<UserProfileDTO>>
    {
        public async Task<Result<UserProfileDTO>> Handle(Query request, CancellationToken cancellationToken)
        {
            return await context.Users
                .ProjectTo<UserProfileDTO>(mapper.ConfigurationProvider, 
                    new { currentUserId = userAccessor.GetUserId() })
                .FindOrFailAsync(x => x.Id == request.Id, cancellationToken);
        }
    }
}
