import "../Styles/Sign.css";
import { useState,useEffect } from "react";
import { useHistory } from "react-router-dom";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import launch_btn from '../Images/launch_btn.png' // Import using relative path
import "../Styles/Lobby.css";
import {motion} from "framer-motion";

const LobbyVariants = {
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
const playerVariants = {
    init : {
        scale : 0
    },
    anim : {
        scale :1,
        transition : {
            type : "spring",
            damping : 9,
            mass : 1,
            bouncing : 1,
            delay : 0.2,
            duration : 3,
        }
    }
}

const Styles = {
    launch: {
        letterSpacing :"2px",
        fontSize : "35px",
        fontWeight : "bold",
        margin : "20px",
        borderRadius:"50px",
        width: "200px",
        height: "90px",
        backgroundImage : `url(${launch_btn})`,
        backgroundPosition : "center",
        backgroundSize : "cover",
        transition : "transform 0.3s",
        "&:hover":{
            transform : "scale(1.1)",
            filter: "brightness(80%)"
        }
    },
    launch_2 : {
        letterSpacing :"2px",
        fontSize : "35px",
        fontWeight : "bold",
        margin : "20px",
        borderRadius:"50px",
        width: "150px",
        color : "white",
        height: "150px",
        background : "linear-gradient(45deg, rgba(255, 64, 0, 1) 40%, #FE6B8B 90%)",
        boxShadow: "6px 3px 5px 2px rgba(255, 105, 135, 1)",
        "&:hover":{ 
            boxShadow: "3px 5px 5px 2px rgba(63, 220, 255, 0.7)",
        }
    },
    select : {
        margin : 10,
        backgroundColor : "#e4b73c",
        padding : "17px",
        borderRadius : "50px",
        width : "10%",
        height : "40px"
    },
 
};

const useStyles = makeStyles(Styles);
function Lobby({socket}){
    const [player_connected,set_Player_connect] = useState([]);
    const [roomId,setRoomId] = useState(null);
    const history = useHistory();
    const classes = useStyles();
    const [host,setHost] = useState(false);
    const [range,setRange] = useState(4);
    const [URL,setURL] = useState("");
    const [invite,setInvite] = useState(false);
    
    useEffect(()=>{
       
        if(socket)
        {
            socket.on("get-players",(player_co)=>{
                if(player_co.length<=15)
                {
                    set_Player_connect(player_co);
                    if(player_co.length<=4)
                        setRange(4-player_co.length);
                    else
                        setRange(0);
                    setRoomId(player_co[0].roomId);
                    const p = player_co.find((p)=>{return p.socketId === socket.id})
                    setHost(p.host);
                } 
                else{
                    if(socket.id === player_co[player_co.length-1].socketId)
                        history.push("/"); 
                    socket.emit("degage-le-dernier",roomId,player_co[player_co.length-1]) ;  
                }
            });
            socket.on("game-started",(player_co)=>{
                set_Player_connect(player_co);
                //console.log(player_co);
                history.push("/start");
                socket.emit("give-players",roomId,player_co);
            });
            socket.on("erreur",()=>{
                history.push("/"); 
            })
            /*socket.on("update-range",(numberOfPlayer)=>{
                setRange(numberOfPlayer-player_connected.length);
            })*/
        }
    },[socket,history,roomId,player_connected]);
    return(
        <motion.div 
        variants = {LobbyVariants}
        initial = "init"
        animate = "anim"
        className="lobby_room"
        >        
            <div className="player_room">
                {                
                    player_connected.map((player)=>{
                        if(player.socketId === socket.id ){
                            return (   
                                <motion.div
                                variants = {playerVariants}
                                initial = "init"
                                animate = "anim" 
                                key = {player.socketId} className="player_block"> 
                                    <div className="avatar_name_block">
                                        <img className="player_avatar" src= {require('../Images/'+player.user_avatar+'.png').default} alt="avatar" />
                                        <p className="player_name">{player.user_name}</p>
                                        {player.host ? <img className ="courrone" src = {require('../Images/couronne.png').default}alt ="host"/> : null}
                                    </div>
                                </motion.div>
                            )
                        }
                        else{
                            return (   
                                <div
                                key = {player.socketId} className="player_block"> 
                                    <div className="avatar_name_block">
                                        <img className="player_avatar" src= {require('../Images/'+player.user_avatar+'.png').default} alt="avatar" />
                                        <p className="player_name">{player.user_name}</p>
                                        {player.host ? <img className ="courrone" src = {require('../Images/couronne.png').default}alt ="host"/> : null}
                                    </div>
                                </div>
                            )
                        }
                    })
                }
                {
                    [...Array(range)].map((elementInArray, index) =>{
                        return (
                            <div key = {index} className="player_block_vide"> 
                                <div className="avatar_name_block">
                                    <img className="player_avatar" src= {require('../Images/tete98.png').default} alt="avatar" />
                                    <p className="player_name">vide</p>
                                </div>
                            </div>
                        )
                    })
                }

            </div>

            <div className="game_mode">
                <div className="link">
                    <h2 className ="t_link">INVITES TES AMIS !</h2>
                </div>
                <h1>{player_connected.length + "/15 JOUEURS"}</h1>
             
                <div className="my_buttons">
                    {
                        host ?  ( 
                        <div className="my_real_button">
                            <Button type="submit" variant="contained"  className={classes.launch} onClick={handleLaunch}>Lancer</Button> 
                            <Button variant="contained"  onClick = {createURL} className={classes.launch}>Inviter</Button>
                        </div>
                        
                        ):
                        <Button variant="contained"  onClick = {createURL} className={classes.launch}>Inviter</Button>
                    }
                
                </div>

                {invite ?  <motion.div  
                            variants = {playerVariants}
                            initial = "init"
                            animate = "anim"  
                            className ="url_invite"> 
                            Lien copié !<br/> Collez le à vos amis :) <br/> "{URL}" </motion.div>
                             : null }
            </div>


        </motion.div>
    );
    /*function handleChange(e){
        socket.emit("update-nop",roomId,(e.target.value));
    }*/
    async function createURL(){
 
        await navigator.clipboard.writeText(`localhost:3000/${roomId}`);
        setURL(`localhost:3000/${roomId}`);
        setInvite(true);
        setTimeout(()=>{setInvite(false)},5000);
       
        
    }
    function handleLaunch(){

        if (player_connected.length < 2) {
            history.push("/");
            return;
        }
        socket.emit("game-launched",roomId,player_connected);
        
    }

   
}
export default Lobby;