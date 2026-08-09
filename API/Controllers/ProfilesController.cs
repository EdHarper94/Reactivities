using System;
using Application.Profiles.Commands;
using Application.Profiles.DTOs;
using Application.Profiles.Queries;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ProfilesController : BaseAPIController
{
    [HttpPost("add-photo")]
    public async Task<ActionResult<Photo>> AddPhoto(IFormFile file)
        => HandleResult(await Mediator.Send(new AddPhoto.Command { File = file }));


    [HttpGet("{userId}/photos")]
    public async Task<ActionResult<List<Photo>>> GetPhotosForUser(string userId)
        => HandleResult(await Mediator.Send(new GetProfilePhotos.Query { UserId = userId }));


    [HttpDelete("{photoId}/photos")]
    public async Task<ActionResult> DeletePhoto(string photoId)
        => HandleResult(await Mediator.Send(new DeletePhoto.Command { PhotoId = photoId }));
    

    [HttpPut("{photoId}/setMain")]
    public async Task<IActionResult> SetMain(string photoId)
        => HandleResult(await Mediator.Send(new SetMainPhoto.Command { Id = photoId }));


    [HttpGet("{userId}")]
    public async Task<ActionResult<UserProfileDTO>> GetProfile(string userId)
        => HandleResult(await Mediator.Send(new GetProfile.Query { Id = userId }));
    

    [HttpPut]
    public async Task<IActionResult> EditProfile(EditProfileDTO profile)
        => HandleResult(await Mediator.Send(new EditProfile.Command { EditProfileDTO = profile}));

    
    [HttpPost("{userId}/follow")]
    public async Task<IActionResult> Follow(string userId) 
        => HandleResult(await Mediator.Send(new FollowToggle.Command { TargetUserId = userId }));


    [HttpGet("{userId}/follow-list")]
    public async Task<IActionResult> GetFollowings(string userId, string predicate)
        => HandleResult(await Mediator.Send(new GetFollowings.Query {UserId = userId, Predicate = predicate}));

}
