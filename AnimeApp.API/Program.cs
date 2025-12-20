using Amazon.Runtime;
using Amazon.S3;
using AnimeApp.API.Extensions;
using AnimeApp.API.Middleware.Exceptions;
using AnimeApp.Application.Contracts;
using AnimeApp.Application.Mapping;
using AnimeApp.Application.Services;
using AnimeApp.Application.Validation.AnimeValidator;
using AnimeApp.Core.Contracts;
using AnimeApp.DataAccess;
using AnimeApp.DataAccess.Repositories;
using AnimeApp.Infrastructure.Auth;
using AnimeApp.Infrastructure.FileStorage;
using AnimeApp.Infrastructure.RedisCache;
using FluentValidation;
using FluentValidation.AspNetCore;
using GenreApp.DataAccess.Repositories;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;
using System.Reflection;
using System.Text.Json.Serialization;


var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;

builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// FluentValidation
builder.Services.AddFluentValidationAutoValidation().AddFluentValidationClientsideAdapters();
//builder.Services.AddValidatorsFromAssemblyContaining<UserRegisterValidator>();

builder.Services.AddValidatorsFromAssemblyContaining<AnimeCreateValidator>();

// Auto Mapper
builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<AnimeProfile>();
    cfg.AddProfile<StudioProfile>();
    cfg.AddProfile<UserProfile>();

});

// Redis 
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
    return ConnectionMultiplexer.Connect(configuration.GetConnectionString("Redis"));
});

// Cache Decorator 
builder.Services.AddScoped<AnimeService>(); 
builder.Services.AddScoped<IAnimeService>(sp =>
{
    var service = sp.GetRequiredService<AnimeService>();
    var cache = sp.GetRequiredService<IRedisCache>();

    return new AnimeCacheDecorator(cache, service);
});



builder.Services.AddDbContext<AnimeAppDbContext>(
    options =>
    {
        options.UseNpgsql(configuration.GetConnectionString(nameof(AnimeAppDbContext)));
    });


// DI Repositories
builder.Services.AddScoped<IAnimeRepository, AnimeRepository>();
builder.Services.AddScoped<IGenreRepository, GenreRepository>();
builder.Services.AddScoped<IStudioRepository, StudioRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserAnimeRepository, UserAnimeRepository>();

// DI Services
builder.Services.AddScoped<IGenreService, GenreService>();
builder.Services.AddScoped<IStudioService, StudioService>();
builder.Services.AddScoped<IUserService, UserService>();

// DI Infrastructure
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IJwtProvider, JwtProvider>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<IRedisCache, RedisCache>();

// Налаштування JWT токену
builder.Services.Configure<JwtOptions>(configuration.GetSection(nameof(JwtOptions)));
var jwtOptions = configuration.GetSection(nameof(JwtOptions)).Get<JwtOptions>()!;
builder.Services.AddApiAuthentication(jwtOptions);

//S3 File Service
builder.Services.AddSingleton<IAmazonS3>(sp =>
{
    var config = new AmazonS3Config
    {
        ServiceURL = builder.Configuration["AWS:ServiceURL"],
        ForcePathStyle = true
    };

    var credentials = new BasicAWSCredentials(
        builder.Configuration["AWS:AccessKey"],
        builder.Configuration["AWS:SecretKey"]
    );

    return new AmazonS3Client(credentials, config);
});

builder.Services.AddSingleton<IS3FileStorageService>(sp =>
    new S3FileStorageService(sp.GetRequiredService<IAmazonS3>(), builder.Configuration["AWS:BucketName"], sp.GetRequiredService<IConfiguration>())
);

// Коментарі свагера
var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
builder.Services.AddSwaggerGen(c =>
{
    c.IncludeXmlComments(xmlPath);
});


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());

});


var app = builder.Build();

// Свагер
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Дозволення фронта
app.UseCors("AllowFrontend");

// Параметри кукі
app.UseCookiePolicy(new CookiePolicyOptions
{
    MinimumSameSitePolicy = SameSiteMode.None,
    HttpOnly = HttpOnlyPolicy.Always,
    Secure = CookieSecurePolicy.Always,
});

// Обробник помилок
app.UseMiddleware<ExceptionMiddleware>();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
