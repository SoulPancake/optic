import React from "react";
import "./register.css"


export default function Register() {
    return (
        <div className="registerContainer">
            <div className="logo"></div>
            <form>
                <input type="text" placeholder="username"></input>
                <input type="email" placeholder="email"></input>
                <input type="password" placeholder="password"></input>
                <button>Register</button>
            </form>
        </div>
    )
}