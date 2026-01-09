using Microsoft.EntityFrameworkCore;
using MyPersonalLibrary.API.Entities;

namespace MyPersonalLibrary.API.Data;

public class LibraryDbContext(DbContextOptions<LibraryDbContext> options) : DbContext(options)
{
    public DbSet<Book> Books { get; set; }
    public DbSet<Author> Authors { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<UserBook> UserBooks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserBook>()
            .HasKey(ub => new { ub.UserId, ub.BookId });

        modelBuilder.Entity<UserBook>()
            .HasOne(ub => ub.User)
            .WithMany(u => u.UserBooks)
            .HasForeignKey(ub => ub.UserId);

        modelBuilder.Entity<UserBook>()
            .HasOne(ub => ub.Book)
            .WithMany(b => b.UserBooks)
            .HasForeignKey(ub => ub.BookId);

        modelBuilder.Entity<Author>().HasData(
            new Author { Id = 1, Name = "Robert C. Martin" },
            new Author { Id = 2, Name = "Andrew Lock" },
            new Author { Id = 3, Name = "Frank Herbert" },
            new Author { Id = 4, Name = "J.K. Rowling" }
        );

        modelBuilder.Entity<Book>().HasData(
            new Book
            {
                Id = 1,
                Title = "Clean Code",
                Year = 2008,
                AuthorId = 1,
                Description =
                    "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. This book offers a handbook of agile software craftsmanship."
            },
            new Book
            {
                Id = 2,
                Title = "Clean Architecture",
                Year = 2017,
                AuthorId = 1,
                Description =
                    "By applying universal rules of software architecture, you can dramatically improve developer productivity throughout the life of any software system."
            },
            new Book
            {
                Id = 3,
                Title = "ASP.NET Core in Action",
                Year = 2021,
                AuthorId = 2,
                Description =
                    "ASP.NET Core in Action opens up the world of cross-platform web development with .NET. It covers the latest features and patterns for building modern web APIs."
            },
            new Book
            {
                Id = 4,
                Title = "Dune",
                Year = 1965,
                AuthorId = 3,
                Description =
                    "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the 'spice' melange."
            },
            new Book
            {
                Id = 5,
                Title = "Dune Messiah",
                Year = 1969,
                AuthorId = 3,
                Description =
                    "Dune Messiah continues the story of Paul Atreides, better known—and feared—as the man christened Muad'Dib. As Emperor of the known universe, he possesses more power than a single man was ever meant to wield."
            },
            new Book
            {
                Id = 6,
                Title = "Harry Potter and the Philosopher's Stone",
                Year = 1997,
                AuthorId = 4,
                Description =
                    "Harry Potter thinks he is an ordinary boy - until he is rescued by an owl, taken to Hogwarts School of Witchcraft and Wizardry, learns to play Quidditch and does battle in a deadly duel."
            }
        );

        modelBuilder.Entity<User>().HasData(
            new User { Id = 1, Username = "dev_reader", Password = "password" },
            new User { Id = 2, Username = "sci_fi_fan", Password = "password" }
        );

        modelBuilder.Entity<UserBook>().HasData(
            new UserBook { UserId = 1, BookId = 1, Status = BookStatus.Finished },
            new UserBook { UserId = 1, BookId = 3, Status = BookStatus.Reading },
            new UserBook { UserId = 1, BookId = 2, Status = BookStatus.WantToRead },
            new UserBook { UserId = 1, BookId = 4, Status = BookStatus.Reading },
            new UserBook { UserId = 2, BookId = 4, Status = BookStatus.Finished },
            new UserBook { UserId = 2, BookId = 5, Status = BookStatus.Finished },
            new UserBook { UserId = 2, BookId = 6, Status = BookStatus.Reading },
            new UserBook { UserId = 2, BookId = 1, Status = BookStatus.WantToRead }
        );
    }
}