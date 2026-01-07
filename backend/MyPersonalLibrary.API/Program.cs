using Microsoft.EntityFrameworkCore;
using MyPersonalLibrary.API.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContextFactory<LibraryDbContext>(options =>
    options.UseInMemoryDatabase("MyLibraryDb"));

builder.Services
    .AddCors(options =>
    {
        options.AddPolicy("AllowReactApp", policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
    })
    .AddGraphQLServer()
    .RegisterDbContextFactory<LibraryDbContext>()
    .AddTypes()
    .AddProjections()
    .AddFiltering()
    .AddSorting()
    .ModifyCostOptions(o => o.EnforceCostLimits = false);

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var factory = scope.ServiceProvider.GetRequiredService<IDbContextFactory<LibraryDbContext>>();
    using var context = factory.CreateDbContext();
    context.Database.EnsureCreated();
}

app.UseCors("AllowReactApp");
app.MapGraphQL();
app.Run();