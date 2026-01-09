namespace MyPersonalLibrary.API.Entities;

public class Book
{
    public int Id { get; set; }

    public required string Title { get; set; }

    public int Year { get; set; }

    public string? Description { get; set; } = string.Empty;

    public int AuthorId { get; set; }
    public Author? Author { get; set; }

    public ICollection<UserBook> UserBooks { get; set; } = new List<UserBook>();
}