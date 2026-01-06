namespace MyPersonalLibrary.API.Entities;

public enum BookStatus
{
    WantToRead,
    Reading,
    Finished
}

public class Book
{
    public int Id { get; set; }
    
    public required string Title { get; set; }
    
    public int Year { get; set; }
    
    public BookStatus Status { get; set; }

    public int AuthorId { get; set; }
    public Author? Author { get; set; }
}