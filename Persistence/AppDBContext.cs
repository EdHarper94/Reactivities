using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class AppDBContext(DbContextOptions options) : DbContext(options)
{
    public required DbSet<Domain.Activity> Activities { get; set; }
}
