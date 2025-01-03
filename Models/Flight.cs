namespace FlightTrackerAPI.Models
{
    public class Flights
    {
        public bool error { get; set; }
        public int total { get; set; }
        public Aircraft[] ac { get; set; }
    }

    public class Aircraft
    {
        public string flight { get; set; }

        public string desc { get; set; }

        public string r { get; set; }

        public string alt_baro { get; set; }

        public double gs { get; set; }

        public double track { get; set; }
        public double trackOld { get; set; }

        public double lat { get; set; }
        public double lon { get; set; }

        public string squawk { get; set; }
    }
}
