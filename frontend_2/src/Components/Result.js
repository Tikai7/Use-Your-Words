import "../Styles/Result.css";
import { Button } from "@mui/material";
import {motion} from "framer-motion";
const ResultatVariant = {
    init : {
        scale : 0
    },
    anim:  i => ({
        scale : 1,
        transition : {
            type : "spring",
            stiffness : 200,
            delay : i*1
        }
    })
}
function Result({ResultVariant,socket,player_connected,roomId,classes}){
    player_connected.sort(compare);
    //console.log(player_connected);
    const cp = player_connected.find((p)=>p.socketId === socket.id)
    return(
        <motion.div 
        variants = {ResultVariant}
        animate = 'anim'
        initial = 'init'
        classeName ="result">
            <h1 className="felicitation">BIEN JOUÉ {player_connected[0].user_name.toUpperCase()} !!!</h1>
            <div className="Podium">
                <motion.div 
                variants = {ResultatVariant}
                initial = 'init'
                animate = 'anim'
                custom = {1.3}
                className="result_bloc">
                    <p className="player_name_reveal">{player_connected[1].user_name}</p>
                    <img className="player_result_2" src= {require('../Images/'+player_connected[1].user_avatar+'.png').default} alt="avatar" />
                    <p className="points">{player_connected[1].points} pts</p>
                </motion.div>
                <motion.div 
                variants = {ResultatVariant}
                initial = 'init'
                animate = 'anim'
                custion = {1}
                className="result_bloc">
                    <img className ="courrone_result" src = {require('../Images/couronne.png').default}alt ="host"/>
                    <p className="player_name_reveal">{player_connected[0].user_name}</p>
                    <img className="player_result_1" src= {require('../Images/'+player_connected[0].user_avatar+'.png').default} alt="avatar" />    
                    <p className="points">{player_connected[0].points} pts</p>
                </motion.div>
                {player_connected.length > 2 ?(
                <motion.div 
                variants = {ResultatVariant}
                initial = 'init'
                animate = 'anim'
                custom = {1.7}
                className="result_bloc">
                    <p className="player_name_reveal">{player_connected[2].user_name}</p>
                    <img className="player_result_3" src= {require('../Images/'+player_connected[2].user_avatar+'.png').default} alt="avatar" />
                    <p className="points">{player_connected[2].points} pts</p>
                </motion.div>):null
                }

            </div>
            <div className ="replay">
                {cp.host ? <Button className = {classes.launch} onClick={handleClickFinish}>Rejouer</Button>
                :  null
                }
            </div>
           
        </motion.div>
    )
    function handleClickFinish(){
       let host = player_connected.find((p)=>p.host === true);
       let host_index = player_connected.indexOf(host);
       let temp_player = player_connected[0];
       player_connected[0] = player_connected[host_index];
       player_connected[host_index] = temp_player;
       
       socket.emit("replay",roomId,player_connected);
    }
    function compare(b,a) {
        return a.points - b.points;
    }
      
     
}

export default Result;