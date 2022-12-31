import React, {useState }from "react";
import { useRef } from "react";
import "./login.css"
import axios from "axios";
import { Cancel } from "@material-ui/icons";

export default function Register({setShowLogin,myStorage,setCurrentUser}) {

    const [failure,setFailure] = useState(false);
    const nameRef = useRef();
    const passwordRef = useRef();
    const handleSubmit =async (e) =>{
        const newUser = {
            username: nameRef.current.value,
            password:passwordRef.current.value
        }
        try{
            const res = await axios.post("/users/login",newUser);
            myStorage.setItem("user",res.data.username);
            setCurrentUser(res.data.username);
            setShowLogin(false);
            setFailure(false);
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
                <input type="password" placeholder="password" ref={passwordRef}></input>
                <button className="registerBtn">Login</button>
                
                {failure&&<span className="failure">Please check your username or password</span>}
            </form>
            <Cancel className="registerCancel" onClick={()=>setShowLogin(false)}></Cancel>
        </div>
    )
}