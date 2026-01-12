using MyPersonalLibrary.API.Data;
using MyPersonalLibrary.API.Entities;
using MyPersonalLibrary.API.Exceptions;

namespace MyPersonalLibrary.API.Types;

public record AuthorPayload(Author Author);

[MutationType]
public static class AuthorsMutations
{
    [Error(typeof(InvalidAuthorNameException))]
    public static async Task<AuthorPayload> CreateAuthor(
        string name,
        LibraryDbContext context)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new InvalidAuthorNameException();
        
        var author = new Author
        {
            Name = name.Trim()
        };

        context.Authors.Add(author);
        await context.SaveChangesAsync();

        return new AuthorPayload(author);
    }
}