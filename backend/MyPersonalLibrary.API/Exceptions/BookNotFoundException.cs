namespace MyPersonalLibrary.API.Exceptions;

public class BookNotFoundException(int bookId)
    : Exception($"Book with id {bookId} was not found.")
{
    public string Code => "BOOK_NOT_FOUND";
}
