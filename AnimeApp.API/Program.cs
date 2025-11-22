using Amazon.Runtime;
using Amazon.S3;
using AnimeApp.API.Mapping;
using AnimeApp.API.Middleware.Exceptions;
using AnimeApp.Application.Contracts;
using AnimeApp.Application.Services;
using AnimeApp.Application.Validation.AnimeValidator;
using AnimeApp.Application.Validation.UserValidator;
using AnimeApp.DataAccess;
using AnimeApp.DataAccess.Repositories;
using AnimeApp.Infrastructure.FileStorage;
using FluentValidation;
using FluentValidation.AspNetCore;
using GenreApp.DataAccess.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Reflection;
using System.Text.Json.Serialization;


var builder = WebApplication.CreateBuilder(args);


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
    //cfg.AddProfile<UserProfile>();
    cfg.AddProfile<AnimeProfile>();
    cfg.AddProfile<StudioProfile>();

});


var configuration = builder.Configuration;

builder.Services.AddDbContext<AnimeAppDbContext>(
    options =>
    {
        options.UseNpgsql(configuration.GetConnectionString(nameof(AnimeAppDbContext)));
    });


// DI Repositories
builder.Services.AddScoped<IAnimeRepository, AnimeRepository>();
builder.Services.AddScoped<IGenreRepository, GenreRepository>();
builder.Services.AddScoped<IStudioRepository, StudioRepository>();

// DI Services
builder.Services.AddScoped<IAnimeService, AnimeService>();
builder.Services.AddScoped<IGenreService, GenreService>();
builder.Services.AddScoped<IStudioService, StudioService>();

// DI Infrastructure

//S3 File Service
builder.Services.AddScoped<IAmazonS3>(sp =>
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

builder.Services.AddScoped<IS3FileStorageService>(sp =>
    new S3FileStorageService(sp.GetRequiredService<IAmazonS3>(), builder.Configuration["AWS:BucketName"], sp.GetRequiredService<IConfiguration>())
);


var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);

builder.Services.AddSwaggerGen(c =>
{
    c.IncludeXmlComments(xmlPath);
});



var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseCors(builder =>
    builder
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()
        .WithOrigins("http://localhost:3000")
);


// Обробник помилок
app.UseMiddleware<ExceptionMiddleware>();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
