using AnimeApp.API.Extensions;
using AnimeApp.API.Hubs;
using AnimeApp.API.Middleware;
using AnimeApp.API.Middleware.Exceptions;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.AspNetCore.DataProtection;
using Serilog;
using StackExchange.Redis;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.AddSerilogLogging();

var configuration = builder.Configuration;

builder.Services
    .AddControllers()
    .AddJsonOptions(o => o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); // Swagger
builder.Services.AddSwaggerWithXml(); // Документація свагера
builder.Services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo("/keys"));

builder.Services
        .AddHttpClient()
        .AddCustomValidation()          // Filters
        .AddValidation()                // FluentValidation
        .AddMapping()                   // Auto Mapper
        .AddServicesDI()                // DI сервісів, репозиторіїв та інфраструктури
        .AddAuth(configuration)         // Auth
        .AddAws(configuration)          // AWS S3 
        .AddQuartzJobs()                // Quartz
        .AddRedis(configuration)        // Redis 
        .AddCacheDecorators()           // Cache Decorator 
        .AddDatabase(configuration)     // DbContext
        .AddCustomCors(configuration)   // Cors 
        .AddMessageBus(configuration)   // RabbitMQ
        .AddMoonApi(configuration)      // Moon Api
        .AddKodikApi(configuration)     // Kodik Api; 
        .AddSignalR();                  // SignalR



var app = builder.Build();

// Serilog
app.UseSerilogRequestLogging();

// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();
app.UseCors("Cors");

// Cookie Policy
app.UseCookiePolicy(new CookiePolicyOptions
{
    MinimumSameSitePolicy = SameSiteMode.None,
    HttpOnly = HttpOnlyPolicy.Always,
    Secure = CookieSecurePolicy.Always,
});

// Exception Middleware
app.UseMiddleware<ExceptionMiddleware>();

if (!app.Environment.IsDevelopment())
    app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

// Analytics
app.UseMiddleware<AnalyticsMiddleware>();

app.MapHub<OnlineHub>("/hubs/online");

app.MapControllers();

///!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
var redis = app.Services.GetRequiredService<IConnectionMultiplexer>();
var db = redis.GetDatabase();
await db.KeyDeleteAsync("metrics:online:active_users");
await db.KeyDeleteAsync("metrics:online:active_guests");

app.Run();
