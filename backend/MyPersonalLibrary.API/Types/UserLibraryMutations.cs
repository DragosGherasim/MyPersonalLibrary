using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using MyPersonalLibrary.API.Data;
using MyPersonalLibrary.API.Entities;
using MyPersonalLibrary.API.Exceptions;

namespace MyPersonalLibrary.API.Types;

public record UpdateBookStatusInput(
    int BookId, 
    BookStatus Status
);

[MutationType]
public static class UserLibraryMutations
{
    [Error(typeof(BookNotFoundException))]
    [Error(typeof(NotAuthenticatedException))]
    [UseFirstOrDefault] 
    [UseProjection]   
    public static async Task<IQueryable<UserBook>> UpdateBookStatus(
        UpdateBookStatusInput input,
        LibraryDbContext context,
        ClaimsPrincipal claimsPrincipal)
    {
        if (claimsPrincipal.Identity?.IsAuthenticated != true) 
            throw new NotAuthenticatedException();

        var userIdString = claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdString, out var userId)) 
            throw new InvalidUserClaimException();

        var userBookEntry = await context.UserBooks
            .FirstOrDefaultAsync(ub => ub.UserId == userId && ub.BookId == input.BookId);

        if (userBookEntry is null)
            throw new BookNotFoundException(input.BookId);
        
        userBookEntry.Status = input.Status;
        await context.SaveChangesAsync();
        
        return context.UserBooks.Where(ub => ub.UserId == userId && ub.BookId == input.BookId);
    }
    
    [Error(typeof(BookNotFoundException))]
    [Error(typeof(NotAuthenticatedException))]
    public static async Task<int> RemoveBookFromLibrary(
        int bookId, 
        LibraryDbContext context,
        ClaimsPrincipal claimsPrincipal)
    {
        if (claimsPrincipal.Identity?.IsAuthenticated != true) 
            throw new NotAuthenticatedException();

        var userIdString = claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdString, out var userId)) 
            throw new InvalidUserClaimException();
        
        var userBookLink = await context.UserBooks
            .FirstOrDefaultAsync(ub => ub.UserId == userId && ub.BookId == bookId);

        if (userBookLink is null)
        {
            throw new BookNotFoundException(bookId);
        }

        context.UserBooks.Remove(userBookLink);
    
        await context.SaveChangesAsync();


        return bookId; 
    }
}