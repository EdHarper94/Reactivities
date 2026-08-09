
using Application.Profiles.Commands;
using Application.Profiles.DTOs;
using FluentValidation;

namespace Application.Activities.Validators;
public class EditProfileValidator<T, TDto> : AbstractValidator<T> where TDto : EditProfileDTO
{
    public EditProfileValidator(Func<T, TDto> selector)
    {
        RuleFor(x => selector(x).DisplayName)
            .NotEmpty().WithMessage("Display Name is required");
    }
}