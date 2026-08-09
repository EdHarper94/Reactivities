using Application.Activities.Commands;
using Application.Activities.DTOs;
using Application.Activities.Queries;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ActivitiesController : BaseAPIController
{   
    [HttpGet]
    public async Task<ActionResult<List<ActivityDTO>>> GetActivities()
        => await Mediator.Send(new GetActivityList.Query());
   
    [HttpGet("{id}")]
    public async Task<ActionResult<ActivityDTO>> GetActivityDetails(string id)
        => HandleResult(await Mediator.Send(new GetActivityDetails.Query { Id = id}));

    [HttpPost]
    public async Task<ActionResult<string>> CreateActivity(CreateActivityDTO activityDTO)
        => HandleResult(await Mediator.Send(new CreateActivity.Command { ActivityDTO = activityDTO }));

    [HttpPut("{id}")]
    [Authorize(Policy = "IsActivityHost")]
    public async Task<IActionResult> EditActivity(string id, EditActivityDTO activity)
    {
        activity.Id = id;
        return HandleResult(await Mediator.Send(new EditActivity.Command { ActivityDTO = activity }));
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "IsActivityHost")]
    public async Task<IActionResult> DeleteActivity(string id)
        => HandleResult(await Mediator.Send(new DeleteActivity.Command { Id = id }));

    [HttpPost("{id}/attend")]
    public async Task<IActionResult> Attend(string id) 
        => HandleResult(await Mediator.Send(new UpdateAttendance.Command { Id = id }));
}

