import * as React from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState } from "react";
import axios from "axios";
import { Star } from "@material-ui/icons";
import "./app.css";
import Avatar from "@material-ui/core/Avatar";

import { format } from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login";
import ThreatModal from "./components/ThreatModal";

import DrawControl from "./components/draw-control";
import ControlPanel from "./components/control-panel";

function App() {
  const mapRef = React.useRef(null);
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [scale, setScale] = useState(1);
  const [pins, setPins] = useState([]);
  const [currentPlaceID, setCurrentPlaceID] = useState(0);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [missionType, setMissionType] = useState(null);
  const [missionDesc, setMissionDesc] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showThreatModal, setShowThreatModal] = useState(false);
  const [criticalLevel, setCriticalLevel] = useState(0);
  const [viewstate, setViewstate] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 46,
    longitude: 17,
    zoom: 1,
  });


  var coordinates = [[-73.9876, 40.7661], [-73.9879, 40.7669]];
  var line = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": coordinates
        }
    }]
};



  function showConnections(){
    let lineStringCoordinates = []
    console.log("Function called")
    const map = mapRef.current.getMap();
    const id = `line-string-layer-${Date.now()}`;
    const routeId = `route-${Date.now()}`
    const usernames = pins.filter(pin => pin.username === currentUser)
    lineStringCoordinates = usernames.map(pin => [pin.longitude, pin.latitude])
    map.addLayer({
      "id": routeId,
      "type": "line",
      "source": {
          "type": "geojson",
          "data": line
      },
      "layout": {
          "line-join": "round",
          "line-cap": "round"
      },
      "paint": {
          "line-color": "#888",
          "line-width": 5
      }
  });
  
    map.addLayer({
      id,
      type: 'line',
      source: {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: lineStringCoordinates
          }
        }
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#ffcc00',
        'line-width': 2
        }
        });
        }


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

  const handleMarkerClick = (id, lat, long) => {
    setViewstate({
      ...viewstate,
      latitude: lat,
      longitude: long,
    });
    if (currentPlaceID === id) {
      setCurrentPlaceID(0); // Clicking twice on marker should close it again
    } else {
      setCurrentPlaceID(id);
    }
  };


  
  const handleHover = (event) => {
    console.log("Hovering");
    setScale(1.5);
  };

  setTimeout(() => {
    if (showRegister || showLogin || showThreatModal) {
      document.getElementsByClassName("mapboxgl-map")[0].style.filter =
        "blur(4px)";
    } else {
      document.getElementsByClassName("mapboxgl-map")[0].style.filter = "none";
    }
  }, 100);

  const handleLeave = (event) => {
    setScale(1);
  };

  const handleAddClick = (e) => {
    const long = e.lngLat.lng;
    const lat = e.lngLat.lat;
    setNewPlace({
      lat,
      long,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return; // We don't want un-logged users to create Mission Pins
    const newPin = {
      username: currentUser,
      title: title,
      type: missionType,
      description: missionDesc,
      critical: criticalLevel,
      lat: newPlace.lat,
      long: newPlace.long,
    };
    console.log(newPin);
    try {
      const res = await axios.post("/pins", newPin);
      console.log("Response is", res);
      setPins([...pins, res.data]);
      setNewPlace(null); // Dismissing form popup
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = (event) => {
    myStorage.removeItem("user");
    setCurrentUser(null);
    window.location.reload();
  };

  const [features, setFeatures] = useState({});

  const onUpdate = (e) => {
    setFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        newFeatures[f.id] = f;
      }
      return newFeatures;
    });
  };

  const onDelete = (e) => {
    setFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        delete newFeatures[f.id];
      }
      return newFeatures;
    });
  };

  return (
    <>
      <Map
        ref={mapRef}
        initialViewState={viewstate}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/navigation-night-v1"
        onMove={(nextViewstate) => setViewstate(nextViewstate)}
        onDblClick={handleAddClick}
      >
        <div>
          <img
            className="opticLogo"
            src={require(".//logo.png")}
            alt="optic logo"
          ></img>
        </div>
        {currentUser ? (
          <button className="button logout" onClick={() => handleLogout()}>
            &nbsp;Log out&nbsp;
          </button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Login
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}{
          <button className="button ontology" onClick={() => showConnections()}>
            &nbsp;View Data Ontology&nbsp;
          </button>
        }
        {pins.map((p) => (
          <>
            <Marker
              className="pin"
              longitude={p.long}
              latitude={p.lat}
              color={p.username == currentUser ? "teal" : "#e11e73"}
              onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              interactive={true}
              onHover={handleHover}
              onLeave={handleLeave}
              scale={scale}
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
                  <h4 className="place">{p.title}</h4>
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
<label>
  Analyse Threats
  <Avatar
                        className="threatLogo"
                        onClick={() => setShowThreatModal(true)}
                        alt="Analyse Threat"
                        src={require(".//threat.png")}
                      />
</label>
                  <label>Critical Level</label>
                  <div className="stars">
                    {Array(p.critical).fill(<Star className="star" />)}
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

        {newPlace && currentUser && (
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            closeButton={true}
            closeOnClick={true}
            anchor={"top"}
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                  placeholder="Enter a title"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Type</label>
                <textarea
                  placeholder="Mission type"
                  onChange={(e) => setMissionType(e.target.value)}
                />
                <label>Description</label>
                <textarea
                  placeholder="Add Mission Description"
                  onChange={(e) => setMissionDesc(e.target.value)}
                />
                <label>Critical Level</label>
                <select onChange={(e) => setCriticalLevel(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button type="submit" className="submitButton">
                  Add Pin
                </button>
              </form>
            </div>
          </Popup>
        )}
        {currentUser && (
          <DrawControl
            position="top-left"
            displayControlsDefault={false}
            controls={{
              polygon: {
                icon: "circle",
              },
              trash: {
                icon: "square",
              },
            }}
            defaultMode="draw_polygon"
            onCreate={onUpdate}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        )}
      </Map>
      {currentUser && <ControlPanel polygons={Object.values(features)} />}
      {showRegister && <Register setShowRegister={setShowRegister}></Register>}
      {showLogin && (
        <Login
          setShowLogin={setShowLogin}
          myStorage={myStorage}
          setCurrentUser={setCurrentUser}
        ></Login>
      )}
      {showThreatModal&& (<ThreatModal setShowThreatModal={setShowThreatModal}/>)}
    </>
  );
}

export default App;
