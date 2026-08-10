using Application.Core;
using Application.Interfaces;
using Application.Profiles.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles.Queries;

public class GetUserActivities
{
    public class Query : IRequest<Result<List<UserActivityDTO>>>
    {
        public required string UserId { get; set; }
        public required string Filter { get; set; }
    }

    public class Handler(AppDBContext context, IUserAccessor userAccessor, IMapper mapper) : IRequestHandler<Query, Result<List<UserActivityDTO>>>
    {
        public async Task<Result<List<UserActivityDTO>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = context.ActivityAttendees
                .Where(u => u.User.Id == request.UserId)
                .OrderBy(x => x.Activity.Date)
                .Select(x => x.Activity)
                .AsQueryable();

             if(!string.IsNullOrEmpty(request.Filter))
            {
                query = request.Filter switch
                {
                    "past" => query.Where(x => x.Date < DateTime.UtcNow && x.Attendees.Any(a => a.UserId == userAccessor.GetUserId())),
                    "host" => query.Where(x => x.Attendees.Any(a => a.IsHost && a.UserId == userAccessor.GetUserId())),
                    _ => query.Where(x => x.Date >= DateTime.UtcNow && x.Attendees.Any(a => a.IsHost && a.UserId == userAccessor.GetUserId()))
                };
            }

            var projectedActivities = query.ProjectTo<UserActivityDTO>(mapper.ConfigurationProvider);

            var activities = await projectedActivities.ToListAsync(cancellationToken: cancellationToken);

            return Result<List<UserActivityDTO>>.Success(activities);
        }
    }
}
