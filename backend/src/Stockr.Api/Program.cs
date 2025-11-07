using System.Text.Json;
using Stockr.Application;
using Stockr.Infrastructure;

const string CorsPolicyName = "AllowFrontend";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "STOCKR API",
        Version = "v1",
        Description = "API for STOCKR - AI-powered sentiment analytics platform",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = "STOCKR Development Team"
        }
    });
    
    // Enable XML documentation
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        options.IncludeXmlComments(xmlPath);
    }
});

builder.Services.AddApplication();
builder.Services.AddInfrastructure();
builder.Services.AddCors(options =>
{
    // Allow localhost and local network IPs (for phone access)
    var allowedOrigins = new List<string> { "http://localhost:4200" };
    
    // Add common local network IP patterns if in Development
    if (builder.Environment.IsDevelopment())
    {
        allowedOrigins.AddRange(new[]
        {
            "http://127.0.0.1:4200",
            "http://0.0.0.0:4200"
        });
        
        // Allow any origin in development for easy local network access
        // In production, you should restrict this to specific domains
        options.AddPolicy(
            CorsPolicyName,
            policy => policy
                .SetIsOriginAllowed(origin => 
                {
                    // Allow localhost and local network IPs (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
                    return origin.StartsWith("http://localhost") ||
                           origin.StartsWith("http://127.0.0.1") ||
                           origin.StartsWith("http://192.168.") ||
                           origin.StartsWith("http://10.") ||
                           origin.StartsWith("http://172.16.") ||
                           origin.StartsWith("http://172.17.") ||
                           origin.StartsWith("http://172.18.") ||
                           origin.StartsWith("http://172.19.") ||
                           origin.StartsWith("http://172.20.") ||
                           origin.StartsWith("http://172.21.") ||
                           origin.StartsWith("http://172.22.") ||
                           origin.StartsWith("http://172.23.") ||
                           origin.StartsWith("http://172.24.") ||
                           origin.StartsWith("http://172.25.") ||
                           origin.StartsWith("http://172.26.") ||
                           origin.StartsWith("http://172.27.") ||
                           origin.StartsWith("http://172.28.") ||
                           origin.StartsWith("http://172.29.") ||
                           origin.StartsWith("http://172.30.") ||
                           origin.StartsWith("http://172.31.");
                })
                .AllowAnyHeader()
                .AllowAnyMethod());
    }
    else
    {
        // Production: only allow specific origins
        options.AddPolicy(
            CorsPolicyName,
            policy => policy
                .WithOrigins(allowedOrigins.ToArray())
                .AllowAnyHeader()
                .AllowAnyMethod());
    }
});
builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
    });

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(CorsPolicyName);

app.MapControllers();

app.Run();
