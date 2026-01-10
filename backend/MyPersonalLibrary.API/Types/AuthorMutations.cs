using HotChocolate;
using HotChocolate.Authorization;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using MyPersonalLibrary.API.Data;
using MyPersonalLibrary.API.Entities;
using MyPersonalLibrary.API.Exceptions;

namespace MyPersonalLibrary.API.Types;

public record AuthorPayload(Author Author);

[ExtendObjectType(OperationTypeNames.Mutation)]
public static class AuthorsMutations
{
    [Authorize]
    [Error(typeof(InvalidAuthorNameException))]
    public static async Task<AuthorPayload> CreateAuthor(
        string name,
        [Service] IDbContextFactory<LibraryDbContext> dbFactory)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new InvalidAuthorNameException();

        await using var db = await dbFactory.CreateDbContextAsync();

        var author = new Author
        {
            Name = name.Trim()
        };

        db.Authors.Add(author);
        await db.SaveChangesAsync();

        return new AuthorPayload(author);
    }
}
