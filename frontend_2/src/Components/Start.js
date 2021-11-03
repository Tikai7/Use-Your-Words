
import {TextField } from "@mui/material";
import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import "../Styles/Start.css";
import launch_btn from '../Images/launch_btn.png' // Import using relative path
import { useState,useEffect } from "react";
import Game from "./Game";
import Reveal from "./Reveal";
import { useHistory } from "react-router";
import Vote from "./Vote";
import Result from "./Result";
import {motion} from "framer-motion";

const Style = {
    launch: {
        letterSpacing :"2px",
        fontSize : "35px",
        color:"white",
        outline : "none",
        fontWeight : "bold",
        margin : "20px",
        borderRadius:"50px",
        width: "220px",
        height: "100px",
        backgroundImage : `url(${launch_btn})`,
        backgroundPosition : "center",
        backgroundSize : "cover",
        transition : "transform 0.3s",
        "&:hover":{
            transform : "scale(1.1)",
            filter: "brightness(80%)"
        }
    },
    noBorder: {
        border: "none",
    },
}
const useStyles = makeStyles(Style);

function Start({socket}){
    const history = useHistory();
    const [mode,setMode] = useState(1);
    const classes = useStyles();
    const [red,setRed] = useState("");
    const [blue,setBlue] = useState("");
    const [player_connected,set_Player_connect] = useState([]);
    const [player_index,setPlayerIndex] = useState([1]);
    const [current_player,setCurrentPlayer] = useState(0);
    const [currentSocketId,setCSID] = useState(0);
    const [roomId,setRoomId] = useState(0);
    const [index,setIndex] = useState(1);
    const [switchAnim,setSwitch] = useState(false);
    const [finish,setFinish] = useState(false);

    const startVariants = {
        init : {
            opacity : 0,
        },
        anim : {
            opacity : 1,
            transition : {
                duration : 0.5,
            }
        }
    }
    const cardVariants = {
        init : {
            x : "100vw"
        },
        anim : {
            x : 0,
            rotateZ : 360,
            transition : {
                type : "spring",
                stiffness : 70,
                duration : 5,
            }
        }
    }
    useEffect(()=>{
        
        if(socket) {
            socket.on("get-players-start",(player_co)=>{
                if(player_co.length<2)
                    history.push("/");  
                set_Player_connect(player_co);
                setCurrentPlayer(player_co.find((p)=>p.turn===true));
                let p = player_co.find((p)=>p.turn===true);
                setCSID(p.socketId);
                setRoomId(player_co[0].roomId);
            });
            socket.on("update-players",(player_co)=>{
                if(player_co.length<2)
                    history.push("/");  
                set_Player_connect(player_co);
            });
            socket.on("change-mode-index",(player_co,ind)=>{
                if(player_co.length<2)
                     history.push("/");  
                setSwitch(false);
                set_Player_connect(player_co);   
                setCurrentPlayer(player_co.find((p)=>p.turn===true));
                if(ind === 2)
                    reset(player_co);
                setMode(ind);       
            });                 
            socket.on("update-red-card",(index,player_index)=>{
                setSwitch(false);
                setSwitch(true);
                setIndex(index);
                setPlayerIndex(player_index);
            })
            socket.on("end-game",()=>{
                history.push("/lobby");
            })
            socket.on("replay-mode",(player_co)=>{
                if(player_co.length<2)
                    history.push("/");  
                set_Player_connect(player_co);   
                setCurrentPlayer(player_co.find((p)=>p.turn===true));
                const index_cp = player_co.indexOf(player_co.find((p)=>p.turn===true));
                socket.emit("replay-red-card",roomId,player_co,index_cp);
            })
        }
    },[socket,history,roomId]);


    if(mode === 1){
        setTimeout(handleClickFinish,60000);
        return(
            <motion.div 
            variants={startVariants}
            initial = 'init'
            animate = 'anim'
            className = "Formulaire">
                <h1>DECRIVEZ UNE SITUATION EN LAISSANT UN BLANC</h1>
                <motion.div 
                whileHover= {{scale : 1.1 ,  transition: { duration: 0.2 },}}
                variants={cardVariants}
                initial = 'init'
                animate = 'anim'
                className ="player_blue_start">
                    <form>  
                        <TextField
                                placeholder = {"Exemple : "+
                                random_exemple()}
                                variant="outlined"
                                multiline
                                rows = {6}        
                                required       
                                InputProps={{
                                    style: {
                                        color: "white",
                                        fontWeight : "bold",
                                        fontSize : 40,
                                        letterSpacing : 2,
                                        disableBorder: true,    

                                    },
                                    classes:{notchedOutline:classes.noBorder},
                                }}      
                                inputProps={{
                                    maxLength: 60
                                  }}  
                                classes = {{notchedOutline : classes.input}}
                                onChange = {(e)=>setBlue(e.target.value)}
                            />
                           
                    </form>
                </motion.div>
                <div className = "finish-button">
                    <Button  className = {classes.launch} onClick={handleClickFinish}>Terminer</Button>
                    {
                        finish ? <img src= {require('../Images/Checked.png').default} className = "check" alt="finish-click"/> : null
                    }
                </div>
            </motion.div>
        )
    }
    else if(mode === 2){
        return (<Game 
        GameVariant = {startVariants}
        socket = {socket}
        current_player = {current_player}
        player_connected = {player_connected}
        currentSocketId = {currentSocketId}
        red = {red}
        setRed ={setRed}
        classes ={classes}
        roomId = {roomId}
        />)
    }
    else if(mode === 3){
        return (<Reveal 
        switchAnim = {switchAnim}
        RevealVariant = {startVariants}
        socket = {socket}
        current_player = {current_player}
        player_connected = {player_connected}
        index = {index}
        roomId = {roomId}
        player_index = {player_index} 
        />)
    }
    else if(mode === 4)
    {
        return (<Vote
        VoteVariant = {startVariants}
        socket = {socket}
        current_player = {current_player}
        player_connected = {player_connected}
        roomId = {roomId}
        />)
    }
    else if(mode === 5)
    {       
        return (<Result
        ResultVariant = {startVariants}
        socket = {socket}
        player_connected = {player_connected}
        roomId = {roomId}
        classes ={classes}
        />)
    }
    else{
        return null;
    }
    function handleClickFinish(){
        let p = player_connected.find((p)=>p.socketId === socket.id);
        if(p){   
            setFinish(true);
            p.blue_card = blue;
            p.isClicked = true;
            socket.emit("finish-click",roomId,player_connected);
        }
    }
    function reset(player_co){
        let cp = player_co.find((p)=>p.turn===true);
        let indice = player_co.indexOf(cp);
        if(indice < player_co.length-1)
            indice++;
        else 
            indice = 0;

        setIndex(indice);
        setPlayerIndex([indice]);
    }
    function random_exemple(){
        let quotes = [
            "Je dois partir c'est l'heure de ____ ",
            "Mes parents m'ont offert pour le BAC ____",
            "Sah quel plaisir de ____ avec toi ^^ ",
            "Putain qu'est ce que c'est bon de ____",
            "____ ? Nahhh Jamais haha ",
            "Est ce que tu t'es _____ ????",
        ]
        return quotes[Math.floor(Math.random()*quotes.length)];
    }
}
export default Start;