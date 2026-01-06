using Microsoft.EntityFrameworkCore;
using MyPersonalLibrary.API.Entities;

namespace MyPersonalLibrary.API.Data;

public class LibraryDbContext(DbContextOptions<LibraryDbContext> options) : DbContext(options)
{
    public DbSet<Book> Books { get; set; }
    public DbSet<Author> Authors { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Author>().HasData(
            new Author { Id = 1, Name = "Jon Skeet" },
            new Author { Id = 2, Name = "Andrew Lock" }
        );

        modelBuilder.Entity<Book>().HasData(
            new Book { Id = 1, Title = "C# in Depth", Year = 1999, AuthorId = 1 },
            new Book { Id = 2, Title = "ASP.NET Core in Action", Year = 2010, AuthorId = 2 },
            new Book { Id = 3, Title = "C# 12 and .NET 8", Year = 2018, AuthorId = 1 }
        );
    }
}