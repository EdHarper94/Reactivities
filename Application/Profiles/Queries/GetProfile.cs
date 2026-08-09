using Application.Core;
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

    public class Handler(AppDBContext context, IMapper mapper) : IRequestHandler<Query, Result<UserProfileDTO>>
    {
        public async Task<Result<UserProfileDTO>> Handle(Query request, CancellationToken cancellationToken)
        {
            return await context.Users
                .ProjectTo<UserProfileDTO>(mapper.ConfigurationProvider)
                .FindOrFailAsync(x => x.Id == request.Id, cancellationToken);
        }
    }
}
