using HotChocolate;
using HotChocolate.Authorization;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using MyPersonalLibrary.API.Data;
using MyPersonalLibrary.API.Entities;
using MyPersonalLibrary.API.Exceptions;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace MyPersonalLibrary.API.Types;

public record BookPayload(Book Book);
public record DeleteBookPayload(bool Success);

[ExtendObjectType(OperationTypeNames.Mutation)]
public static class BooksMutations
{
[Authorize]
[Error(typeof(AuthorNotFoundException))]
[Error(typeof(InvalidBookYearException))]
[Error(typeof(InvalidTitleException))]
public static async Task<BookPayload> CreateBook(
    string title,
    int year,
    string? description,
    int authorId,
    [Service] IDbContextFactory<LibraryDbContext> dbFactory,
    [Service] IHttpContextAccessor httpContextAccessor)
{
    if (string.IsNullOrWhiteSpace(title)) throw new InvalidTitleException();
    if (year > 2026) throw new InvalidBookYearException(year);

    await using var db = await dbFactory.CreateDbContextAsync();

    var authorExists = await db.Authors.AnyAsync(a => a.Id == authorId);
    if (!authorExists) throw new AuthorNotFoundException(authorId);

    var book = new Book
    {
        Title = title.Trim(),
        Year = year,
        Description = description ?? "",
        AuthorId = authorId
    };

    db.Books.Add(book);
    await db.SaveChangesAsync();

    // ✅ Link the new book to the current user's library (UserBooks)
    // In your model, UserId is INT, so we resolve the current user from DB.
    var httpContext = httpContextAccessor.HttpContext;

    // Prefer username-based lookup (works regardless of claim type)
    var username =
        httpContext?.User?.FindFirstValue(ClaimTypes.Name) ??
        httpContext?.User?.FindFirstValue("username") ??
        httpContext?.User?.Identity?.Name;

    if (!string.IsNullOrWhiteSpace(username))
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Username == username);

        if (user is not null)
        {
            var alreadyLinked = await db.UserBooks
                .AnyAsync(ub => ub.UserId == user.Id && ub.BookId == book.Id);

            if (!alreadyLinked)
            {
                db.UserBooks.Add(new UserBook
                {
                    UserId = user.Id,
                    BookId = book.Id,
                    Status = BookStatus.WantToRead // default choice
                });

                await db.SaveChangesAsync();
            }
        }
    }

    return new BookPayload(book);
}

    

    [Authorize]
    [Error(typeof(BookNotFoundException))]
    [Error(typeof(AuthorNotFoundException))]
    [Error(typeof(InvalidBookYearException))]
    [Error(typeof(InvalidTitleException))]
    public static async Task<BookPayload> UpdateBook(
        int id,
        string? title,
        int? year,
        string? description,
        int? authorId,
        [Service] IDbContextFactory<LibraryDbContext> dbFactory)
    {
        await using var db = await dbFactory.CreateDbContextAsync();

        var book = await db.Books.FirstOrDefaultAsync(b => b.Id == id)
                   ?? throw new BookNotFoundException(id);

        if (title is not null)
        {
            if (string.IsNullOrWhiteSpace(title)) throw new InvalidTitleException();
            book.Title = title.Trim();
        }

        if (year is not null)
        {
            if (year > 2026) throw new InvalidBookYearException(year.Value);
            book.Year = year.Value;
        }

        if (description is not null)
        {
            book.Description = description;
        }

        if (authorId is not null)
        {
            var exists = await db.Authors.AnyAsync(a => a.Id == authorId.Value);
            if (!exists) throw new AuthorNotFoundException(authorId.Value);

            book.AuthorId = authorId.Value;
        }

        await db.SaveChangesAsync();
        return new BookPayload(book);
    }

    [Authorize]
    [Error(typeof(BookNotFoundException))]
    public static async Task<DeleteBookPayload> DeleteBook(
        int id,
        [Service] IDbContextFactory<LibraryDbContext> dbFactory)
    {
        await using var db = await dbFactory.CreateDbContextAsync();

        var book = await db.Books.FirstOrDefaultAsync(b => b.Id == id)
                   ?? throw new BookNotFoundException(id);

        // Optional cleanup: remove user-book links first (prevents dangling rows)
        var links = await db.UserBooks.Where(ub => ub.BookId == id).ToListAsync();
        if (links.Count > 0)
        {
            db.UserBooks.RemoveRange(links);
        }

        db.Books.Remove(book);
        await db.SaveChangesAsync();

        return new DeleteBookPayload(true);
    }
}
