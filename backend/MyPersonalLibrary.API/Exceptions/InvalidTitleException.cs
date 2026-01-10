namespace MyPersonalLibrary.API.Exceptions;

public class InvalidTitleException()
    : Exception("Title is required.")
{
    public string Code => "BOOK_INVALID_TITLE";
}
