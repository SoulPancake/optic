import React, {useState }from "react";
import { useRef } from "react";
import "./register.css"
import axios from "axios";
import { Cancel } from "@material-ui/icons";

export default function Register({setShowRegister}) {

    const [success,setSuccess] = useState(false);
    const [failure,setFailure] = useState(false);
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const handleSubmit =async (e) =>{
        e.preventDefault();
        const newUser = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password:passwordRef.current.value
        }
        try{
            await axios.post("/users/register",newUser);
            setFailure(false);
            setSuccess(true);
        }catch(e){
            setFailure(true);
            console.log(e);
        }
    }
    return (
        <div className="registerContainer">
            

            <div className="logo">
                <img src={require(".//logo.png")} alt="optic logo"></img>
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="username" ref={nameRef}></input>
                <input type="email" placeholder="email" ref={emailRef}></input>
                <input type="password" placeholder="password" ref={passwordRef}></input>
                <button className="registerBtn">Register</button>
                {success&&<span className="success">Successful, You can login now!</span>}
                {failure&&<span className="failure">Something went wrong, Please try again!</span>}
            </form>
            <Cancel className="registerCancel" onClick={()=>setShowRegister(false)}></Cancel>
        </div>
    )
}