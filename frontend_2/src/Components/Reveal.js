
import { Button } from "@mui/material";
import "../Styles/Reveal.css";
import { makeStyles } from "@mui/styles";
import launch_btn from '../Images/launch_btn.png' // Import using relative path
import {motion} from "framer-motion";

const playerVariants = {
    init : {
        scale :0,
    },
    anim : {
        scale : 1,
        transition : {
            type : "spring",
            stiffness : 70,
            duration : 3,
        }
    },
    switchAnimation : {
        scale : 1 ,
        y : [0,1000,0],
        x : [0,1000,0],
        transition : {
            type : "spring",
            stiffness : 100,
            duration : 0.7,
        }
    }
}

const Style = {
    launch: {
        letterSpacing :"2px",
        fontSize : "35px",
        color:"white",
        outline : "none",
        fontWeight : "bold",
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
    }
}
const useStyle = makeStyles(Style);

function Reveal({switchAnim,RevealVariant,socket,current_player,player_connected,index,roomId,player_index}){
    const classes = useStyle();
    //console.log(index);
    //console.log(player_connected);
    return (
        <motion.div 
        variants = {RevealVariant}
        animate = "anim"
        initial = "init"
        className="reveal_room">
            <div className="player_reveal_room">
                {
                    player_connected.map((player)=>{
                        return (
                            <motion.div 
                            variants = {playerVariants}
                            initial ="init"
                            animate = "anim"
                            key = {player.socketId} className="player_block_reveal"> 
                                <div className="avatar_name_block_reveal">
                                    <img className="player_avatar_reveal" src= {require('../Images/'+player.user_avatar+'.png').default} alt="avatar" />
                                    <p className="player_name_reveal">{player.user_name}</p>
                                </div>
                            </motion.div>
                        )
                    })
                }

            </div>
            <div className="card_player">
                <motion.div 
                variants = {playerVariants}
                initial ="init"
                animate = "anim"
                className="blue_player_card">
                    {current_player.blue_card}
                </motion.div>
                <motion.div 
                variants = {playerVariants}
                initial ="init"
                animate = {switchAnim ? "switchAnimation" : "anim"}
                className="red_player_card">
                    <span>{player_connected[index].red_card}</span>
                </motion.div>
            </div>
            {current_player.socketId === socket.id ?
            ( <Button onClick = {handleNext} className = {classes.launch}>Suivant</Button> ): null }
            
        </motion.div>  
    )


    function handleNext(){
        const index_cp = player_connected.indexOf(current_player);
        //console.log(index_cp);
        if(player_index.length < (player_connected.length-1)){
            while( index === index_cp || player_index.includes(index)){
                index = Math.floor(Math.random()*player_connected.length);
            }
            player_index.push(index);
            socket.emit("next-red-card",roomId,index,player_index);
        }
        else{
            socket.emit("vote-time",roomId,player_connected);
            //socket.emit("replay-red-card",roomId,player_connected,index_cp);
        }
    }
}   
export default Reveal;