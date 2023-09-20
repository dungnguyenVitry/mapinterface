import LocationOn from "@mui/icons-material/LocationOn";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import { useState, useRef } from "react";
import "./register.css";

export default function Register({ setShowRegister }) {

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value
        }; try {
            const res = await axios.post("https://travelpin-back.onrender.com/api/pins/register", newUser); 
            setError(false);
            setSuccess(true);
        } catch (error) {
            setError(true);
        }
    }

  return (
    <div className="registerContainer">
        <div className="logo">
            <LocationOn/>
            GomgomPin
        </div>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="username" ref = {nameRef}/>
            <input type= "email" placeholder="email" ref = {emailRef}/>
            <input type="password" placeholder="password" ref = {passwordRef}/>
            <button className="registerBtn">Register</button>
            {success && <span className="success">Successfull. You can login now!</span>}
            {error && <span className="failure">Something went wrong!</span>}
        </form>
        <CancelIcon className="registerCancel" onClick={() => setShowRegister(false)}/>
    </div>
  )
}
