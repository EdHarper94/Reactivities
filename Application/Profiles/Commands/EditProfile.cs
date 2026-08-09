using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Application.Profiles.DTOs;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Persistence;

namespace Application.Profiles.Commands;

public class EditProfile
{
    public class Command : IRequest<Result<Unit>>
    {
       public required EditProfileDTO EditProfileDTO { get; set;}
    }

    public class Handler(AppDBContext context, IMapper mapper, IUserAccessor userAccessor)
        : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
         => await context.Users
            .FindOrFailAsync(x=> x.Id == userAccessor.GetUserId(), cancellationToken)
            .BindAsync(async entity =>
            {
                
                mapper.Map(request.EditProfileDTO, entity);

                await context.SaveChangesAsync(cancellationToken);

                return Result<Unit>.Success(Unit.Value);
            });
    }
}
