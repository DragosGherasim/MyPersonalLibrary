namespace MyPersonalLibrary.API.Exceptions;

public class AuthorNotFoundException(int authorId)
    : Exception($"Author with id {authorId} was not found.")
{
    public string Code => "AUTHOR_NOT_FOUND";
}
