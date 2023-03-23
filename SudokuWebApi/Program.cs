using SudokuWebApi.Data;
using Microsoft.EntityFrameworkCore;
using SudokuWebApi;

var builder = WebApplication.CreateBuilder(args);
var builderConfigure = builder.Configuration.GetConnectionString("DefaultConnection");

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "SpecificOption",
                      builder =>
                      {
                          builder.WithOrigins("*").AllowAnyHeader().AllowAnyMethod();
                      });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<SudokuDbContext>(options => options.UseSqlServer(builderConfigure));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseDefaultFiles();

app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseCors("SpecificOption");

app.UseAuthorization();

app.MapControllers();

app.Run();
