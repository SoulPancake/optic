import * as React from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState } from "react";
import axios from "axios";
import { Star } from "@material-ui/icons";
import "./app.css";
import Avatar from "@material-ui/core/Avatar";

import { format } from "timeago.js";

function App() {
  const currentUser = "Jane"
  const [pins, setPins] = useState([]);
  const [currentPlaceID, setCurrentPlaceID] = useState(0);
  const [viewstate, setViewstate] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 46,
    longitude: 17,
    zoom: 1,
  });

  React.useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id) => {
    if ( currentPlaceID === id) {
      setCurrentPlaceID(0); // Clicking twice on marker should close it again
    }else{
      setCurrentPlaceID(id);
    }
    
  };

  function handleMapClick(e) {
     
  }


  return (
    <Map
      initialViewState={viewstate}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/navigation-night-v1"
      onMove={(nextViewstate) => setViewstate(nextViewstate)}
      onClick={handleMapClick}
    >
      {pins.map((p) => (
        <>
          <Marker
            className="pin"
            longitude={p.long}
            latitude={p.lat}
            color={p.username===currentUser?"green":"#e11e73"}
            onClick={() => handleMarkerClick(p._id)}
            interactive={true}
          ></Marker>

          {p._id === currentPlaceID && (
            <Popup
              longitude={p.long}
              latitude={p.lat}
              anchor="top"
              closeButton={true}
              closeOnClick={false}
              onClose={() => setCurrentPlaceID(0)}
            >
              <div className="card">
                <label>Place</label>
                <h4 className="place">Eiffel Tower</h4>
                <label>Type</label>
                <p className="desc">{p.description}</p>

                <label>
                  Join Nest
                  <a href="https://syncnest.onrender.com/">
                    <Avatar
                      className="syncNestLogo"
                      alt="SyncNest - Logo"
                      src={require(".//SyncNest.png")}
                    />
                  </a>
                  <br></br>
                </label>

                <label>Critical Level</label>
                <div className="stars">
                  <Star className="star" />
                  <Star className="star" />
                  <Star className="star" />
                  <Star className="star" />
                </div>
                <label>Information </label>
                <span className="username">
                  Created by <b>{p.username}</b>
                </span>
                <span className="date">{format(p.createdAt)}</span>
              </div>
            </Popup>
          )}
        </>
      ))}
    </Map>
  );
}

export default App;
