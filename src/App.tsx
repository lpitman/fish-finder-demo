import { useState, useEffect } from 'react'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'
import Map from './Map'

// fixing missing marker icons in leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import FishForm from './FishForm'

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

export interface Fish {
  id: string;
  species: string;
  trackingInfo: string;
  weightKG: number;
  location: Location;
}

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8088'}/fish`
const REFERESH_INTERVAL = 5000 // 5 seconds


function App() {
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // state for new fish form
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newFishSpecies, setNewFishSpecies] = useState('');
  const [newFistTrackingInfo, setNewFishTrackingInfo] = useState('');

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

        <Map fishes={fishes} />

        <FishForm API_URL={API_URL} setError={setError} ></FishForm>

        <div className='table-container'>
                <table className='fish-table'>
                    <thead>
                        <tr>
                            <th>Species</th>
                            <th>Tracking Info</th>
                            <th>Weight (kg)</th>
                            <th>Location (lat, lon)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fishes.map(fish => (
                            <tr key={fish.id} className='table-row'>
                                <td className='table-cell'>{fish.species}</td>
                                <td className='table-cell'>{fish.trackingInfo}</td>
                                <td className='table-cell'>{fish.weightKG}</td>
                                <td className='table-cell'>
                                    {fish.location.latitude.toFixed(4)}, {fish.location.longitude.toFixed(4)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        
        <footer style={{ textAlign: 'center', marginTop: '1rem', color: '#888', fontSize: '0.9rem' }}>
          <p>Map data updates automatically. Last update: {lastUpdated.toLocaleTimeString()}</p>
        </footer>
      </div>
    </>
  )
}

export default App
