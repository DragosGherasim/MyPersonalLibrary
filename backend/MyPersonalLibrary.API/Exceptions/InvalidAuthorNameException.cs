namespace MyPersonalLibrary.API.Exceptions;

public class InvalidAuthorNameException()
    : Exception("Author name is required.")
{
    public string Code => "AUTHOR_INVALID_NAME";
}
