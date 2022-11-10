import * as React from 'react';
import Map,{Marker} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState } from 'react';

function App() {
  const [viewstate, setViewstate] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 46,
    longitude: 17,
    zoom: 6

  })
  return (
    <Map
      initialViewState={viewstate}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX}
      style={{width: "100vw", height: "100vh"}}
      mapStyle="mapbox://styles/mapbox/navigation-night-v1"
      onMove={nextViewstate=>setViewstate(nextViewstate)}
    >
     
     <Marker longitude={46} latitude={17} anchor="bottom" >
     
    </Marker>

      
    </Map>
  );
}

export default App;