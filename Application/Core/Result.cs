using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Core;

public class Result<T>
{
    public bool IsSuccess { get; set; }
    public T? Value { get; set; }
    public string? Error { get; set; }
    public int Code { get; set; }

    public static Result<T> Success(T value) => new () {IsSuccess = true, Value = value};
    public static Result<T> Failure(string error, int code) => new ()
    {
        IsSuccess = false,
        Error = error,
        Code = code
    };

    public Result<TOut> Bind<TOut>(Func<T, Result<TOut>> next)
        => IsSuccess ? next(Value!) : Result<TOut>.Failure(Error!, Code);

    public async Task<Result<TOut>> BindAsync<TOut>(Func<T, Task<Result<TOut>>> next)
        => IsSuccess ? await next(Value!) : Result<TOut>.Failure(Error!, Code);
}

public static class ResultExtensions
{
    public static async Task<Result<TOut>> Bind<T, TOut>(
        this Task<Result<T>> task,
        Func<T, Result<TOut>> next)
    {
        var result = await task;
        return result.Bind(next);
    }

    public static async Task<Result<TOut>> BindAsync<T, TOut>(
        this Task<Result<T>> task,
        Func<T, Task<Result<TOut>>> next)
    {
        var result = await task;
        return await result.BindAsync(next);
    }
}
