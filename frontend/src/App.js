import * as React from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState } from "react";
import axios from "axios";
import { Star } from "@material-ui/icons";
import "./app.css";
import Avatar from "@material-ui/core/Avatar";
import {format} from 'timeago.js'
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
function App() {
  const [pins, setPins] = useState([]);
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

  // const [showPopup, setShowPopup] = React.useState(true);
  return (
    <Map
      initialViewState={viewstate}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/navigation-night-v1"
      onMove={(nextViewstate) => setViewstate(nextViewstate)}
    >
      {pins.map((p) => (
        <>
          <Marker 
            longitude={p.long} 
            latitude={p.lat} 
            
           
          >

            <CoronavirusIcon>

            </CoronavirusIcon>

          </Marker>

          <Popup 
            longitude={p.long} 
            latitude={p.lat} 
            anchor="bottom">
            <div className="card">
              <label>Place</label>
              <h4 className="place">Eiffel Tower</h4>
              <label>Type</label>
              <p className="desc">{p.description}</p>

              <label>
                Join Nest
                <Avatar
                  className="syncNestLogo"
                  alt="SyncNest - Logo"
                  src={require(".//SyncNest.png")}
                />
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
        </>
      ))}
    </Map>
  );
}

export default App;
