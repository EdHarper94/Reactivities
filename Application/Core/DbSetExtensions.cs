using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace Application.Core;

public static class DbSetExtensions
{
    public static async Task<Result<T>> FindOrFailAsync<T>(
        this DbSet<T> dbSet,
        object id,
        CancellationToken ct = default) where T : class
    {
        var entity = await dbSet.FindAsync([id], ct);
        return entity is null
            ? Result<T>.Failure($"{typeof(T).Name} not found", 404)
            : Result<T>.Success(entity);
    }

    public static async Task<Result<T>> FindOrFailAsync<T>(
        this IQueryable<T> query,
        Expression<Func<T, bool>> predicate,
        CancellationToken ct = default) where T : class
    {
        var entity = await query.FirstOrDefaultAsync(predicate, ct);
        return entity is null
            ? Result<T>.Failure($"{typeof(T).Name} not found", 404)
            : Result<T>.Success(entity);
    }
}