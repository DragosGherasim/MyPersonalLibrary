namespace MyPersonalLibrary.API.Exceptions;

public class BookNotInLibraryException(int bookId) : Exception($"Book {bookId} is not in the current user's library.")
{
    public int BookId { get; } = bookId;
}
