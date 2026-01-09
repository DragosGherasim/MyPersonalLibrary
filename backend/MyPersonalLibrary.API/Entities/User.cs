namespace MyPersonalLibrary.API.Entities;

public class User
{
    public int Id { get; set; }
    public required string Username { get; set; }
    public required string Password { get; set; }

    public ICollection<UserBook> UserBooks { get; set; } = new List<UserBook>();
}