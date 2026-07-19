using Application.Activities.Commands;
using Application.Activities.DTOs;
using Application.Activities.Queries;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ActivitiesController : BaseAPIController
{   
    [HttpGet]
    public async Task<ActionResult<List<Activity>>> GetActivities()
        => await Mediator.Send(new GetActivityList.Query());
   

    [HttpGet("{id}")]
    public async Task<ActionResult<Activity>> GetActivityDetails(string id)
        => HandleResult(await Mediator.Send(new GetActivityDetails.Query { Id = id}));

    [HttpPost]
    public async Task<ActionResult<string>> CreateActivity(CreateActivityDTO activityDTO)
        => HandleResult(await Mediator.Send(new CreateActivity.Command { ActivityDTO = activityDTO }));

    [HttpPut]
    public async Task<IActionResult> EditActivity(EditActivityDTO activity)
        => HandleResult(await Mediator.Send(new EditActivity.Command { ActivityDTO = activity }));


    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteActivity(string id)
        => HandleResult(await Mediator.Send(new DeleteActivity.Command { Id = id }));
}

