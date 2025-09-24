import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'

// fixing missing marker icons in leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41] // point of the icon which will correspond to marker's location
});
L.Marker.prototype.options.icon = DefaultIcon;

interface Location {
  latitude: number;
  longitude: number;
}

interface Fish {
  id: string;
  species: string;
  trackingInfo: string;
  weightKG: number;
  location: Location;
}

const API_HOST = import.meta.env.VITE_API_HOST || 'localhost';
const API_PORT = import.meta.env.VITE_API_PORT || '8088';
const API_URL = `${API_HOST}${API_PORT === '80' ? '' : `:${API_PORT}`}/fish`;
const REFERESH_INTERVAL = 5000 // 5 seconds
const HALIFAX_COORDS: [number, number] = [44.692661, -63.639532] // Halifax, Nova Scotia
const MAP_ZOOM_LEVEL = 14



function App() {
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // fetch data from the go backend
  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Fish[] = await response.json();
      setFishes(data || []);
      setError(null);
      setLastUpdated(new Date());
    } catch (e) {
      console.error(`Failed to fetch fish data: ${e}`);
      setError(`Could not connect to the fish tracker API. Is the Go server running? If so, you'd better go catch it :D`);
    }
  };

  // Effect hook to fetch data on component mount and then on a recurring interval
  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, REFERESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className='map'>
        <header className='map-header'>
          <h1 className='h1'>Fish Tracker</h1>
          <p>
            Live map of tracked fish in the Halifax Area. Demo only.
          </p>
        </header>
        {error && (
          <div className='error-banner'>
              <strong>Error: </strong>{error}
          </div>
        )}

        <MapContainer center={HALIFAX_COORDS} zoom={MAP_ZOOM_LEVEL}>
          <TileLayer 
            attribution='&copy; <a href="[https://www.openstreetmap.org/copyright](https://www.openstreetmap.org/copyright)">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {fishes.map((fish) => (
            <Marker key={fish.id} position={[fish.location.latitude, fish.location.longitude]}>
              <Popup>
              <div>
                <h3 style={{ fontWeight: 'bold', fontSize: '1.1rem', margin: 0 }}>{fish.species}</h3>
                <p><strong>Weight:</strong> {fish.weightKG.toFixed(2)} kg</p>
                <p><strong>Tracker:</strong> {fish.trackingInfo}</p>
              </div>
            </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        <footer style={{ textAlign: 'center', marginTop: '1rem', color: '#888', fontSize: '0.9rem' }}>
          <p>Map data updates automatically. Last update: {lastUpdated.toLocaleTimeString()}</p>
        </footer>
      </div>
    </>
  )
}

export default App
