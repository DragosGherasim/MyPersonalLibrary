using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MyPersonalLibrary.API.Data;
using MyPersonalLibrary.API.Services;

var builder = WebApplication.CreateBuilder(args);

// DB
builder.Services.AddDbContextFactory<LibraryDbContext>(options =>
    options.UseInMemoryDatabase("MyLibraryDb"));

// AUTH + JWT
builder.Services.AddScoped<AuthService>();

var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKey))
{
    // Dev fallback so the app still works even if config is missing.
    jwtKey = "DEV_FALLBACK_KEY_CHANGE_ME_TO_A_LONG_RANDOM_SECRET_32+_CHARS";
}

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),

            ValidateIssuer = false,
            ValidateAudience = false,

            // dev-safe: prevents expired/no-exp tokens from failing
            ValidateLifetime = false,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddHttpContextAccessor();


// ASP.NET authorization services
builder.Services.AddAuthorization();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// GRAPHQL
builder.Services
    .AddGraphQLServer()
    .AddAuthorization() // 
    .RegisterDbContextFactory<LibraryDbContext>()
    .AddTypes()
    .AddProjections()
    .AddFiltering()
    .AddSorting()
    .AddMutationConventions()
    .ModifyCostOptions(o => o.EnforceCostLimits = false);

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var factory = scope.ServiceProvider.GetRequiredService<IDbContextFactory<LibraryDbContext>>();
    using var context = factory.CreateDbContext();
    context.Database.EnsureCreated();
}

app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization(); 

app.MapGraphQL();

app.Run();
