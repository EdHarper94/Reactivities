using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class AppDBContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
    public required DbSet<Domain.Activity> Activities { get; set; }
}
