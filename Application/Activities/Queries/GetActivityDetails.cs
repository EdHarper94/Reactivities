using Application.Activities.DTOs;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Queries;

public class GetActivityDetails
{
    public class Query : IRequest<Result<ActivityDTO>>
    {
        public required string Id { get; set; }
    }

    public class Handler(AppDBContext context, IMapper mapper) : IRequestHandler<Query, Result<ActivityDTO>>
    {
        public async Task<Result<ActivityDTO>> Handle(Query request, CancellationToken cancellationToken)
            => (await context.Activities
                .ProjectTo<ActivityDTO>(mapper.ConfigurationProvider)
                .FindOrFailAsync(a => a.Id == request.Id, cancellationToken))
                .Bind(activity => Result<ActivityDTO>.Success(activity));
    }
}
