using System.Security.Claims;
using MyPersonalLibrary.API.Data;
using MyPersonalLibrary.API.Entities;
using MyPersonalLibrary.API.Exceptions;

namespace MyPersonalLibrary.API.Types;

[QueryType]
public static class UserLibraryQueries
{
    [UsePaging(IncludeTotalCount = true)] 
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<UserBook> GetMyLibrary(
        LibraryDbContext context,
        ClaimsPrincipal claimsPrincipal)
    {
        if (claimsPrincipal.Identity?.IsAuthenticated != true) throw new NotAuthenticatedException();

        var userIdString = claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdString, out var userId)) throw new InvalidUserClaimException();

        return context.UserBooks.Where(ub => ub.UserId == userId);
    }
}