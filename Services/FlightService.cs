using FlightTrackerAPI.Models;
using Newtonsoft.Json;

namespace FlightTrackerAPI.Services
{
    public class FlightService
    {
        private readonly HttpClient _httpClient;

        public FlightService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<Flights> GetFlightsAsync(double latitude, double longitude, double radius)
        {
            string baseUrl = $"https://api.airplanes.live/v2/point/" +  "/" +  latitude.ToString() + "/" + longitude.ToString() + "/" + radius.ToString();

            var response = await _httpClient.GetAsync(baseUrl);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new HttpRequestException($"Error fetching data: {response.StatusCode} - {response.ReasonPhrase}. Details: {errorContent}");
            }

            var content = await response.Content.ReadAsStringAsync();

            Flights flight = JsonConvert.DeserializeObject<Flights>(content);

            return flight;
        }
    }
}