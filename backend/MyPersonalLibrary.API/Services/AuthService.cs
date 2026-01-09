using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MyPersonalLibrary.API.Data;
using MyPersonalLibrary.API.Entities;

namespace MyPersonalLibrary.API.Services;

public class AuthService(IDbContextFactory<LibraryDbContext> dbContextFactory, IConfiguration config)
{
    public async Task<(string Token, User User)?> AuthenticateAsync(string username, string password)
    {
        await using var context = await dbContextFactory.CreateDbContextAsync();

        var user = await context.Users
            .FirstOrDefaultAsync(u => u.Username == username && u.Password == password);

        if (user == null) return null;

        var secretKey = config["Jwt:Key"];
        var key = Encoding.UTF8.GetBytes(secretKey!);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.Username)
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(1),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return (tokenHandler.WriteToken(token), user);
    }
}