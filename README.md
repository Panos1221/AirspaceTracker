# Airspace Tracker

## Airspace Tracker is a web-based application for monitoring live air traffic within a specified area. It uses real-time data from REST APIs and presents it on an interactive map.

## REST APIs Used
1. Airplanes.LIVE API
    Provides real-time flight data for aircraft within a specific radius.
    Due to API limitations, the application can only monitor flights within a 250 nautical mile radius of a position.

2. Planespotters API
    Fetches aircraft images based on their registration numbers for detailed visualization.

## Technologies used
* Frontend: HTML, CSS, JavaScript
* Backend: C# with ASP.NET Core
* Data Serialization: Newtonsoft.Json
