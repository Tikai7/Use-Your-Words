import "../Styles/Vote.css"
import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {motion} from "framer-motion";

/*const redVariant = {
    init : {
        opacity : 0.1,
        scale : 0.1,
    },
    animate:  i => ({
        opacity : 1,
        scale : 1,
        transition : {
            type : "spring",
            stiffness : 100,
            delay : i*0.5
        }
    })
}*/
const Style = {
    vote : {
        padding :"30px",
        lineHeight: "120%",
        color: "white",
        margin : "10px",
        fontSize: "40px",
        fontWeight: "bold",
        borderRadius: "50px",
        width: "25%",
        height: "370px", 
        "@media (max-width: 800px)": {
            width: "500px",
            height: "215px", 
        },
        background : "linear-gradient(45deg, rgba(255, 64, 0, 1) 40%, #FE6B8B 90%)",
        boxShadow: "6px 3px 5px 2px rgba(255, 105, 135, 1)",
        "&:hover":{ 
            boxShadow: "3px 5px 5px 2px rgba(63, 220, 255, 0.7)",
        }
    }
}
const useStyle = makeStyles(Style);

function Vote({VoteVariant,socket,current_player,player_connected,roomId}){
    const classes = useStyle();
    return (
        <motion.div
        variants = {VoteVariant}
        initial = 'init'
        animate = 'anim'
        >
            <div className="player_reveal_room">
                {
                    player_connected.map((player)=>{
                        return (
                            <div key = {player.socketId} className="player_block_reveal"> 
                                <div className="avatar_name_block_reveal">
                                    <img className="player_avatar_reveal" src= {require('../Images/'+player.user_avatar+'.png').default} alt="avatar" />
                                    <p className="player_name_reveal">{player.user_name}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className="red_cards">
                    <h1>VOTEZ POUR LA CARTE LA PLUS DROLE !</h1>
                    <h2 className="b_c">{current_player.blue_card}</h2>
                    <div className="red_cards_main">
                    {player_connected.map((player)=>{
                        if( player.socketId !== current_player.socketId) {
                            return (
                                <Button
                                key = {''+player.socketId+''+Date.now()} 
                                className ={classes.vote} 
                                onClick = {()=>{handlePoints(player.socketId)}}
                                > 
                                    <div 
                                    className="myDiv">
                                        {player.red_card} 
                                    </div>
                                </Button>
                            )
                        }
                        else
                            return null
                    })}
                    </div>
            </div>
        </motion.div>
    )
    function handlePoints(value){
        let p = player_connected.find((p)=>socket.id === p.socketId);
        //console.log(value);
        if(!p.isVoting){ 
            for(let player of player_connected) {
                if(value === player.socketId){
                    player.points+=1;
                    //console.log(player.points);
                }
            }
            p.isVoting = true;
            socket.emit("i-voted",roomId,player_connected);
            //console.log(player_connected);
        }   
    }

}
export default Vote;