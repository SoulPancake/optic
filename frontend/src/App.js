import * as React from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState } from "react";
import axios from "axios";
import {  Star } from "@material-ui/icons";
import "./app.css";
import Avatar from "@material-ui/core/Avatar";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import {format} from 'timeago.js';

function App() {
  const [pins, setPins] = useState([]);
  const [currentPlaceID,setCurrentPlaceID] = useState(null);
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


   const handleMarkerClick = (id,lat,long) => {
          setCurrentPlaceID(lat,long);
          if(showPopup) setShowPopup(false);
          else setShowPopup(true)
  };

  const openModal = (lat,long) =>{
      console.log("Open Modal called" , lat,long)
      handleOpen()
  }

   const [showPopup, setShowPopup] = React.useState(false);

   const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };


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
                    onClick={()=>openModal(p.lat,p.long)}
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
           
         <Modal
        hideBackdrop
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ width: 200 }}>
          <h2 id="child-modal-title">Text in a child modal</h2>
          <p id="child-modal-description">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
         
        </Box>
      </Modal>
        
          
        </ >
      ))}
    </Map>
  );
}

export default App;
