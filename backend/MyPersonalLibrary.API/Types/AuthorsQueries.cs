using MyPersonalLibrary.API.Data;
using MyPersonalLibrary.API.Entities;

namespace MyPersonalLibrary.API.Types;

[QueryType]
public static class AuthorsQueries
{
    [UseProjection] // Allows the client to ask for nested books (author { books { title } })
    public static IQueryable<Author> GetAuthors(LibraryDbContext context)
    {
        return context.Authors;
    }
}