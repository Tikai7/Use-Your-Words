require('dotenv').config();
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");

let rooms_array = [];

const io = socket(server,
    {
        cors:{
            origin: process.env.FRONT_URL,
            credentials: true
        }
    }
);

io.on('connection',(socket)=>{
    console.log("User connected at room : "+socket.id);

    socket.on("user-data",(socketId,user)=>{
        
        let current_room = null;
        if(user.roomId === null){
            current_room = createRoom(user);
            socket.join(current_room.id);
            io.sockets.in(current_room.id).emit("get-players",current_room.players);
        }
        else {
            current_room = rooms_array.find(r=>r.id === user.roomId);
            if(current_room === undefined)
                return;
            
            if(current_room.players[0] !== undefined){
                if(current_room.players[0].isPlaying === false){
                    current_room.players.push(user)   
                    socket.join(current_room.id);
                    io.sockets.in(current_room.id).emit("get-players",current_room.players);
                }else{
                    io.sockets.in(socketId).emit("erreur");
                }
            }
            else
                return;
          
        } 
       
    })

    socket.on("disconnect",()=>{
        //console.log(""+socket.id+" disconnected");
        rooms_array.forEach((rooms)=>{
            rooms.players.forEach(player=>{
                if(player.socketId === socket.id){
                    if(player.host === true) {
                        const p = rooms.players.find((p)=>{return !p.host});
                        if(p)
                            p.host = true;
                        if(player.turn === true && p)
                            p.turn = true;
                    }
                    rooms.players.splice(rooms.players.indexOf(player),1);
                    io.sockets.in(rooms.id).emit("get-players",rooms.players);
                    io.sockets.in(rooms.id).emit("update-players",rooms.players);
                }
            })
        })
       
    })

    socket.on("game-launched",(roomId,player_co)=>{
        //console.log('--------------- SET PLAYING ---------------------')
        setPlaying(player_co,true);
        //console.log('--------------- SET PLAYING ---------------------')

        update_current_room(roomId,player_co);
        io.sockets.in(roomId).emit("game-started",player_co);
    })
    socket.on("give-players",(roomId,player_co)=>{
        update_current_room(roomId,player_co);
        io.sockets.in(roomId).emit("get-players-start",player_co);
    })
    socket.on("finish-click",(roomId,player_co)=>{
        update_current_room(roomId,player_co);
        let p = player_co.find((p)=>p.isClicked === false);
        if(p === undefined)
            io.sockets.in(roomId).emit("change-mode-index",player_co,2);
        else
            io.sockets.in(roomId).emit("update-players",player_co);
    })
    socket.on("finish-click-game",(roomId,player_co)=>{
        update_current_room(roomId,player_co);

        let p = player_co.find((p)=>p.isClicked_red === false && p.turn !== true) ;

        if(p === undefined)
            io.sockets.in(roomId).emit("change-mode-index",player_co,3);
        else
            io.sockets.in(roomId).emit("update-players",player_co);
    })
    socket.on("next-red-card",(roomId,index,player_index)=>{
        io.sockets.in(roomId).emit("update-red-card",index,player_index);     
    })
    socket.on("replay-red-card",(roomId,player_co,index_cp)=>{
        update_current_room(roomId,player_co);

        let cp = player_co[index_cp];
        cp.turn = false;
        if(index_cp < player_co.length-1){
            index_cp+=1;
            player_co[index_cp].turn = true;
            reset_players(player_co);
            io.sockets.in(roomId).emit("change-mode-index",player_co,2);     
        }
        else {
            let cp_host = player_co.find((p)=>p.host === true)
            cp_host.turn = true;
            reset_everything(player_co);
            io.sockets.in(roomId).emit("change-mode-index",player_co,5);     
        }
    })
    socket.on("vote-time",(roomId,player_co)=>{
        update_current_room(roomId,player_co);

        io.sockets.in(roomId).emit("change-mode-index",player_co,4);    
    })
    socket.on("i-voted",(roomId,player_co)=>{
        update_current_room(roomId,player_co);

        let p = player_co.find((p)=>p.isVoting === false);
        if(p === undefined)
            io.sockets.in(roomId).emit("replay-mode",player_co);
        else
            io.sockets.in(roomId).emit("update-players",player_co);
    })
    socket.on("replay",(roomId,player_co)=>{
        reset_points(player_co);
        update_current_room(roomId,player_co);
        //console.log(player_co);
        io.sockets.in(roomId).emit("end-game");
        io.sockets.in(roomId).emit("get-players",player_co);     
    })
    socket.on("degage-le-dernier",(roomId,dernier_joueur)=>{
        let room = rooms_array.find((r)=>r.id = roomId)
        if(room){
            room.players.splice(room.players.indexOf(dernier_joueur),1);
            io.sockets.in(roomId).emit("get-players",room.players);
        }
    })
    /*socket.on("update-nop",(roomId,numberOfPlayer)=>{
        io.sockets.in(roomId).emit("update-range",numberOfPlayer);
    })*/
})

function setPlaying(player_co,bool){
    for(let player of player_co)
        player.isPlaying = bool;
    //console.log(player_co);
}

function update_current_room(roomId,player_co){
    let current_room = rooms_array.find((room)=>room.id === roomId);
    if(current_room){
        current_room.players = player_co;
        //console.log('--------------- SET ROOM ---------------------')
        //console.log(current_room.players);
        //console.log('--------------- SET ROOM ---------------------')
    }
}

function reset_players(player_co){
    for(let player of player_co){
        player.isClicked_red = false;
        player.isVoting = false;
    }
}

function reset_points(player_co){
    for(let player of player_co)
        player.points = 0;

}

function reset_everything(player_co){
    setPlaying(player_co,false);
    reset_players(player_co);
    for(let player of player_co){
        player.red_card = "";
        player.blue_card = "";
        player.isClicked = false;
    }
}

function createRoom(user){
    //const roomId = "" + Math.floor(Math.random()* 1000) + Date.now();
    const roomId = Math.random().toString(32).substr(2,9).toUpperCase();
    const current_room = {id : roomId, players : []};
    user.roomId = current_room.id;
    current_room.players.push(user);
    rooms_array.push(current_room);
    return current_room;
}

server.listen(process.env.PORT);