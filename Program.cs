using FlightTrackerAPI.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient<FlightService>();
builder.Services.AddControllers();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseAuthorization();

app.UseStaticFiles(); 

app.UseRouting();

app.MapControllers();
app.MapFallbackToFile("index.html"); 

app.Run();