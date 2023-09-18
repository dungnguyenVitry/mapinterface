
import * as React from 'react';
import { useEffect, useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import axios from "axios"
import "./app.css";
// eslint-disable-next-line

import { format } from 'timeago.js';
import Register from './components/Register';
import Login from './components/Login';


function App() {
  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = useState(myStorage.getItem("user"));
  const [currentUser, setCurrentUser] = useState(null);
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [viewState, setViewState] = useState({
    latitude: 47.040182,
    longitude: 17.071727,
    zoom: 4
  })

  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showLogout, setShowLogout] = useState(false);




  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data)
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, [])

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewState({
      ...viewState,
      latitude: lat,
      longitude: long
    })
    console.log(viewState)
  }

  const handleAddClick = (e) => {
    setNewPlace({
      lat: e.lngLat.lat,
      long: e.lngLat.lng,
    })

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      description,
      rating,
      lat: newPlace.lat,
      long: newPlace.long
    }
    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (error) {
      console.log(error)
    }
  }

  const handleLogout = () => {
    setCurrentUsername(null);
    myStorage.removeItem("user");
  };


  return (
    <div style={{ height: "100vh", width: "100%" }}>

      <Map
        initialViewState={{
          latitude: 47.040182,
          longitude: 17.071727,
          zoom: 4
        }}
        onViewStateChange={({ viewState }) => setViewState(viewState)}

        width="100%"
        height="100%"
        mapboxAccessToken="pk.eyJ1IjoiZHVuZ2xhbm5pb24iLCJhIjoiY2xtamEwMGFmMDI4bDJrb28xb3kyd3p3eSJ9.ykZDNLOV-S0EEU073d_vgQ"
        transitionDuration="200"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        // mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
        onDblClick={handleAddClick}
      >

        {pins.map(p =>
          <>
            <Marker longitude={p.long} latitude={p.lat} anchor="bottom" >
              <LocationOnIcon style={{ color: p.username === currentUser ? "tomato" : "slateblue", cursor: 'pointer' }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              />
            </Marker>
            {p._id === currentPlaceId && (
              <Popup
                key={p._id}
                latitude={p.lat}
                longitude={p.long}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
                anchor="left"
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.description}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(p.rating).fill(<StarIcon className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{p.username}</b>
                  </span>
                  <span className="date">{format(p.createdAt)}</span>
                </div>
              </Popup>

            )}
          </>
        )}
        {newPlace && (
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
            anchor="left"
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input placeholder='Enter a title' onChange={(e) => setTitle(e.target.value)} />
                <label>Review</label>
                <textarea placeholder='Enter something about this place' onChange={(e) => setDescription(e.target.value)}></textarea>
                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className='submitButton' type='submit'>Add Pin</button>
              </form>
            </div>
          </Popup>
        )}
        {currentUsername ? (
          <button className="button logout" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Log in
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            setCurrentUsername={setCurrentUsername}
            myStorage={myStorage}
          />
        )}

      </Map >
    </div>

  );

}
export default App;
