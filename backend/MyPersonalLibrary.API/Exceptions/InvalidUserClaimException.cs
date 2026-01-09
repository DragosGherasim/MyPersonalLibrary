namespace MyPersonalLibrary.API.Exceptions;

public class InvalidUserClaimException() 
    : Exception("User identity claim is invalid or missing.")
{
    public string Code => "AUTH_INVALID_USER_CLAIM";
}