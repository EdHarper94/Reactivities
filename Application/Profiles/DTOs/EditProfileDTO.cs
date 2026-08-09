using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Profiles.DTOs;

public class EditProfileDTO
{
    public string DisplayName { get; set; } = "";
    public string? Bio { get; set; } = "";
}
