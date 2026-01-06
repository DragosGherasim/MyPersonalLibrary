using Microsoft.EntityFrameworkCore;
using MyPersonalLibrary.API.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContextFactory<LibraryDbContext>(options =>
    options.UseInMemoryDatabase("MyLibraryDb"));

builder.Services
    .AddGraphQLServer()
    .RegisterDbContextFactory<LibraryDbContext>()
    .AddTypes()
    .AddProjections()
    .AddFiltering()
    .AddSorting();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var factory = scope.ServiceProvider.GetRequiredService<IDbContextFactory<LibraryDbContext>>();
    using var context = factory.CreateDbContext();
    context.Database.EnsureCreated();
}

app.MapGraphQL();
app.Run();