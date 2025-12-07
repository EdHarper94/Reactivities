using Application.Activities.Commands;
using Application.Activities.Queries;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ActivitiesController : BaseAPIController
{   
    [HttpGet]
    public async Task<ActionResult<List<Activity>>> GetActivities()
    {
        var activities = await Mediator.Send(new GetActivityList.Query());
        return Ok(activities);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Activity>> GetActivityDetails(string id)
    {
        var activity = await Mediator.Send(new GetActivityDetails.Query { Id = id });        
        return Ok(activity);
    }

    [HttpPost]
    public async Task<ActionResult<string>> CreateActivity(Activity activity)
    {
        var id = await Mediator.Send(new CreateActivity.Command { Activity = activity });
        return Ok(id);
    }

    [HttpPut]
    public async Task<IActionResult> EditActivity(Activity activity)
    {
        await Mediator.Send(new EditActivity.Command { Activity = activity });
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteActivity(string id)
    {
        await Mediator.Send(new DeleteActivity.Command { Id = id });
        return NoContent();
    }
    
}

