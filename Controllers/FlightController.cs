using FlightTrackerAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace FlightTrackerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FlightController : ControllerBase
    {
        private readonly FlightService _flightService;

        public FlightController(FlightService flightService)
        {
            _flightService = flightService;
        }

        [HttpGet]
        public async Task<IActionResult> GetFlights()
        {
            try
            {
                // Greece's central coordinates
                double latitude = 37.9838;
                double longitude = 23.7275;
                double radius = 250; //In Nautical Miles

                var flights = await _flightService.GetFlightsAsync(latitude, longitude, radius);
                if (flights == null || flights.total == 0)
                {
                    return NotFound("No flight data available for Greece.");
                }

                return Ok(flights);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }
    }
}