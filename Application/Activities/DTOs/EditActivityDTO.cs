using System.ComponentModel.DataAnnotations;

namespace Application.Activities.DTOs;

public class EditActivityDTO : BaseActivityDTO
{
    public string Id { get; set; } = "";
}
