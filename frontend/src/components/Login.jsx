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
        e.preventDefault();
        const newUser = {
            username: nameRef.current.value,
            password: passwordRef.current.value
        }
        try{
            const res = await axios.post("/users/login",newUser);
            console.log(res.data)
            setCurrentUser(res.data.username);
            myStorage.setItem('user',res.data.username);
            console.log("User name",res.data.username);
            console.log("Local storage",myStorage.getItem('user'));
            
            setShowLogin(false);
            // window.location.reload();
        }catch(e){
            setFailure(true);
            console.log(e);
        }
    }
    return (
        <div className="registerContainer">
            

            <div className="logo">
                <img src={require(".//logo2.png")} alt="optic logo"></img>
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