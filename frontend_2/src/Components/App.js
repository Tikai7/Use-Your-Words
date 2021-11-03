import "../Styles/App.css"
import Sign from "./Sign";
import Lobby from "./Lobby";
import {BrowserRouter as Router, Route,Switch} from 'react-router-dom';          
import {io} from "socket.io-client";
import { useEffect,useState } from "react";
import Start from "./Start";
import { ThemeProvider } from "@mui/material";
import theme from "./Theme";



function App() {

    const URL = process.env.REACT_APP_BACK_URL;
    const [socket,setSocket] =  useState();
    
    useEffect(()=>{ 
        const socket = io(URL);
        setSocket(socket);
        //console.log(socket);

        window.onbeforeunload = () => {
            socket.disconnect() ;
        }
        window.onpopstate = ()=>{
            socket.disconnect();
        }
        
    },[])
  
    return (
        <ThemeProvider theme = {theme}>
            <Router>
                <Switch>
                    <Route exact path="/">
                        <Sign socket={socket} />
                    </Route>
                    <Route exact path="/lobby">
                    <Lobby socket={socket} />
                    </Route>
                    <Route exact path="/start">
                        <Start socket={socket} />    
                    </Route>
                    <Route path ="/:id">
                        <Sign socket={socket} />
                    </Route>
                </Switch>
            </Router>
        </ThemeProvider>
        
    );
}

export default App;
