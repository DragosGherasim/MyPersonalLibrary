using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using MyPersonalLibrary.API.Data;
using MyPersonalLibrary.API.Entities;
using MyPersonalLibrary.API.Exceptions;

namespace MyPersonalLibrary.API.Types;

public record AddBookInput(
    string Title,
    int Year,
    string? Description,
    int AuthorId
);

[MutationType]
public static class BooksMutations
{
    [Error(typeof(AuthorNotFoundException))]
    [Error(typeof(InvalidBookYearException))]
    [Error(typeof(InvalidTitleException))]
    [Error(typeof(NotAuthenticatedException))]
    [UseFirstOrDefault]
    [UseProjection]
    public static async Task<IQueryable<Book>> AddBook(
        AddBookInput input,
        LibraryDbContext context,
        ClaimsPrincipal claimsPrincipal)
    {
        if (string.IsNullOrWhiteSpace(input.Title))
            throw new InvalidTitleException();

        if (input.Year > DateTime.UtcNow.Year)
            throw new InvalidBookYearException(input.Year);

        if (claimsPrincipal.Identity?.IsAuthenticated != true)
            throw new NotAuthenticatedException();

        var userIdString = claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdString, out var userId))
            throw new InvalidUserClaimException();

        var authorExists = await context.Authors.AnyAsync(a => a.Id == input.AuthorId);
        if (!authorExists)
            throw new AuthorNotFoundException(input.AuthorId);

        var newBook = new Book
        {
            Title = input.Title.Trim(),
            Year = input.Year,
            Description = input.Description ?? "",
            AuthorId = input.AuthorId
        };

        var userBookLink = new UserBook
        {
            UserId = userId,
            Book = newBook,
            Status = BookStatus.WantToRead
        };

        context.UserBooks.Add(userBookLink);

        await context.SaveChangesAsync();

        return context.Books.Where(b => b.Id == newBook.Id);
    }
}