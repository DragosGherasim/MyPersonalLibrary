using MyPersonalLibrary.API.Entities;
using MyPersonalLibrary.API.Services;
using MyPersonalLibrary.API.Exceptions; 

namespace MyPersonalLibrary.API.Types;

public record LoginPayload(string Token, User User);

[MutationType]
public static class AuthMutations
{
    [Error(typeof(InvalidCredentialsException))]
    public static async Task<LoginPayload> Login(
        string username,
        string password,
        AuthService authService)
    {
        var result = await authService.AuthenticateAsync(username, password);
        
        return result == null ? throw new InvalidCredentialsException() :
            new LoginPayload(result.Value.Token, result.Value.User);
    }
}