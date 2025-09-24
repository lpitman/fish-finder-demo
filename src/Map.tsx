import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import type { Fish } from './App'

const HALIFAX_COORDS: [number, number] = [44.692661, -63.639532] // Halifax, Nova Scotia
const MAP_ZOOM_LEVEL = 14

type MapProps = {
    fishes: Fish[];
}

function Map({fishes}: MapProps) {
    return (
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
    )
}

export default Map;