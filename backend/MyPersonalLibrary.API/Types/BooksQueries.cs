using MyPersonalLibrary.API.Data;
using MyPersonalLibrary.API.Entities;

namespace MyPersonalLibrary.API.Types;

[QueryType]
public static class BooksQueries
{
    [UseFirstOrDefault] // Takes the query and runs .FirstOrDefaultAsync() for books ()
    [UseProjection]    
    public static IQueryable<Book> GetBookById(int id, LibraryDbContext context)
    {
        return context.Books.Where(b => b.Id == id);
    }
    
    [UsePaging(IncludeTotalCount = true)] 
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Book> GetBooks(LibraryDbContext context)
    {
        return context.Books;
    }
}