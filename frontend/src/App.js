import * as React from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState } from "react";
import { Star } from "@material-ui/icons";
import "./app.css";
function App() {
  const [viewstate, setViewstate] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 46,
    longitude: 17,
    zoom: 1,
  });
  const [showPopup, setShowPopup] = React.useState(true);
  return (
    <Map
      initialViewState={viewstate}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/navigation-night-v1"
      onMove={(nextViewstate) => setViewstate(nextViewstate)}
    >
      <Marker longitude={46} latitude={17} anchor="bottom"></Marker>
      {showPopup && (
        <Popup
          longitude={46}
          latitude={17}
          anchor="bottom"
          onClose={() => setShowPopup(false)}
        >
          <div className="card">
            <label>Place</label>
            <h4 className="place">Eiffel Tower</h4>
            <label>Type</label>
            <p className="desc">Recon Op</p>
            <label>Critical Level</label>
            <div className="stars">
              <Star />
              <Star />
              <Star />
              <Star />
            </div>
            <label>Information </label>
            <span className="username">
              Created by <b>Anurag</b>
            </span>
            <span className="date">1 hour ago</span>
          </div>
        </Popup>
      )}
    </Map>
  );
}

export default App;
