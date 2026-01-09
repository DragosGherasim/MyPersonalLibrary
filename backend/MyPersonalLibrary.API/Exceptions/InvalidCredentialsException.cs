namespace MyPersonalLibrary.API.Exceptions;

public class InvalidCredentialsException() : Exception("Invalid username or password")
{
    public string Code => "AUTH_INVALID_CREDENTIALS";
}