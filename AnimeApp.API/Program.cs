using AnimeApp.API.Extensions;
using AnimeApp.API.Middleware.Exceptions;
using Microsoft.AspNetCore.CookiePolicy;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

builder.Services
    .AddControllers()
    .AddJsonOptions(o => o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); // Swagger
builder.Services.AddSwaggerWithXml(); // Коментарі свагера

builder.Services
        .AddValidation() // FluentValidation
        .AddMapping() // Auto Mapper
        .AddServicesDI() // Впровадження залежностей сервісів, репозиторіїв та інфраструктури
        .AddAuth(configuration) // Auth
        .AddAws(configuration) // AWS S3 
        .AddQuartzJobs() // Quartz
        .AddRedis(configuration) // Redis 
        .AddCacheDecorators() // Cache Decorator 
        .AddDatabase(configuration) // DbContext
        .AddCustomCors(); // Cache Decorator 


var app = builder.Build();

// Свагер
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

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
