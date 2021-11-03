
import {TextField } from "@mui/material";
import { Button } from "@mui/material";
import "../Styles/Game.css";
import {motion} from "framer-motion";
import { useState } from "react";
//import { useEffect, useState } from "react";

const RedVariants = {
    init : {
        y : "100vw"
    },
    anim : {
        y : 0,
        transition : {
            type : "spring",
            stiffness : 70,
            duration : 5,
        }
    }
}
const BlueVariants = {
    init : {
        y : "-100vw"
    },
    anim : {
        y : 0,
        transition : {
            type : "spring",
            stiffness : 70,
            duration : 5,
        }
    },
   
}

function Game({GameVariant,socket,current_player,player_connected,currentSocketId,red,setRed,classes,roomId}) {

       const [finish,setFinish] = useState(false);
       if(socket && socket.id){
        return (
            <motion.div 
            variants = {GameVariant}
            initial = "init"
            animate = "anim"
            className="game_room">
                {current_player.socketId !== socket.id ? (
                    <h1>COMPLETER LES BLANCS EN ETANT LE PLUS DROLE POSSIBLE </h1> ) 
                    :(
                        <h1>LES AUTRES JOUEURS SONT ENTRAIN DE COMPLETER VOTRE BLANC...</h1>        
                    )
                }
                <div className="player_card">
                    {current_player.socketId !== socket.id ? 
                    (
                        <motion.div 
                        variants = {RedVariants}
                        initial = "init"
                        whileHover= {{scale : 1.1 ,  transition: { duration: 0.2 },}}
                        animate = "anim"
                        className="player_red">
                            <form>
                                <TextField
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
                                            lineHeight: "110%",

                                        },
                                        classes:{notchedOutline:classes.noBorder}
                                    }}   
                                    inputProps={{
                                        maxLength: 50
                                      }}  
                                    classes = {{notchedOutline : classes.input}}
                                    onChange = {(e)=>setRed(e.target.value)}
                                  
                                />
                            </form>
                        </motion.div> 
                    ):
                    null
                    } 
    
                    <motion.div 
                    variants = {BlueVariants}
                    initial = "init"
                    animate = "anim"
                    className="player_blue">
                        {current_player.blue_card}
                    </motion.div>
                 
                </div>
                <div className="finish-button">
                {
                    current_player.socketId !== socket.id ? (
                    <Button className = {classes.launch} onClick={handleClickFinish} >Terminer</Button>
                    ):null
                    }
                    {finish ? <img src= {require('../Images/Checked.png').default} className = "check" alt="finish-click"/> : null}
                </div>
            </motion.div>
        )
       }
       else
        return null;
        
    
    /*function clickAuto(){
        setTimeout(handleClickFinish,60000);
    }*/
    function handleClickFinish(){
        let p = player_connected.find((p)=>p.socketId === socket.id);
        if(p){
            p.red_card = red;
            p.isClicked_red = true;
            setFinish(true)
            //console.log(player_connected);
            socket.emit("finish-click-game",roomId,player_connected);
        }
       
    }
}
export default Game;
