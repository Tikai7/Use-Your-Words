import "../Styles/Sign.css";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button"
import { makeStyles } from "@mui/styles";
import back from '../Images/back.png' // Import using relative path
import launch_btn from '../Images/launch_btn.png' // Import using relative path
import { useHistory } from "react-router-dom";
import {motion} from "framer-motion";
import Header from "./Header";
import { useParams } from "react-router";

const user_player = {
    host : false,
    user_name : "",
    user_avatar : "",
    roomId : null,
    socketId : "",
    turn : false,
    blue_card : "",
    red_card : "",
    isClicked : false,
    isClicked_red : false,
    isVoting : false,
    isPlaying : false,
    points : 0,
}
const Styles = {
    launch: {
        letterSpacing :"3px",
        fontSize : "30px",
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
    change : {
        backgroundImage : `url(${back})`,
        backgroundPosition : "center",
        backgroundSize : "cover",
        marginRight : "7%",
        marginTop :"-20%",
        marginBottom :"5%",
        fontSize: "10px",
        borderRadius: "70px",
        padding: "10px",
        width: "70px",
        height: "70px",
        transition : "transform 0.3s",
        "&:hover":{
            transform : "scale(1.1)",
            filter: "brightness(80%)"
        }
    },
};

const useStyles = makeStyles(Styles);
const gameInscriptionVariants = {
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
function Sign({socket}){
    
    const history = useHistory();
    const classes = useStyles();
    const min = 1;
    const max = 98;
    const [rand,setRand] = useState(min + (Math.floor(Math.random() * (max-min))));
    const [name,setName] = useState("Tikai7");
    const [room,setRoom] = useState("");
    const {id} = useParams();
    useEffect(()=>{
        if(id)
            setRoom(id);
       

    },[id])
   
    return (
        <motion.div
        variants={gameInscriptionVariants}
        initial = 'init'
        animate = 'anim'
        className ="game_g"
        >
            <Header classes={classes}/> 
            <div 
            className="game_inscription"
            >
                {id ? <h1 className="Supplement">TU AS ÉTÉ INVITÉ PAR UN AMI !</h1> : null}
                <h1>CHOISIS TON PSEUDO ET AVATAR</h1>
                <div className="game_pseudo_image">
                    <div className="image_change">
                        <figure>
                            <img className="user_avatar" src= {require('../Images/tete'+rand+'.png').default} alt="avatar"/>
                            
                        </figure>
                        <Button 
                        className={classes.change} 
                        alt="load_avatar" 
                        src={require('../Images/back.png').default} 
                        onClick={()=>{setRand(min + (Math.floor(Math.random() * (max-min))))}}
                        />
                    </div>
                    <form  className="user_form" onSubmit={handleSubmit}>
                        <input onChange = {(e)=>setName(e.target.value)} className="user_pseudo" placeholder="Pseudo" required maxLength={9}/>
                        {/*<input onChange = {(e)=>setRoom(e.target.value)}  className="user_room" placeholder ="Room"  maxLength={9} />*/}
                        <Button type="submit" variant="contained" className={classes.launch}>{ id ? "Rejoindre" : "Demarrer"}</Button>
                       
                    </form>
                </div>
               

            </div>
        </motion.div>
    )

    function handleSubmit(e){
        e.preventDefault();
        user_player.host = true;
        user_player.turn = true;
        if(room !== ""){
            user_player.roomId = room;
            user_player.host = false;
            user_player.turn = false;
        }
        
        user_player.socketId = socket.id;
        user_player.user_name = name;
        user_player.user_avatar = "tete"+rand;
    
        socket.emit("user-data",socket.id,user_player);
 
        history.push("/lobby");
    }
}


export default Sign;