namespace MyPersonalLibrary.API.Exceptions;

public class NotAuthenticatedException() 
    : Exception("You must be logged in to access your library.")
{
    public string Code => "AUTH_NOT_AUTHENTICATED";
}

