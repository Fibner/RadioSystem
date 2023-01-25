import {Link} from 'react-router-dom';
import "../css/Home.css";
import logo from "../pictures/fblogo.png"
export const Home = ()=>{
    function login(){
        window.open("https://10.0.1.26:4999/facebook", "_self");
    }
    return (
        <div id='welcome-text'>
            Radiowęzeł wita!
            Aby dodać piosenke lub zobaczyc historie zaloguj się!
            <br/>
            <div><img src={logo} alt='Facebook logo'/><input type={'button'} value='Zaloguj przez Facebook' onClick={login}/></div>
        </div>
    );
}