const express = require('express');
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessages,generateLocationMessages} = require('./utils/messages')
const {addUser,removeUser,getUser,getUserInRoom} = require('../src/utils/users')

const app = express();
const server = http.createServer(app)
const io = socketio(server)



const viewspath = path.join(__dirname,'../templates/views')
const partialpath = path.join(__dirname,'../templates/partials')
const publicdirectorypath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000


app.use(express.static(publicdirectorypath))


io.on('connection',(socket)=>{
    socket.on('join',({username,room},callback)=>{
        const { error,user} = addUser({id:socket.id,username,room})

        if(error){
            return callback(error)
        }
        socket.join(user.room)

        socket.emit('message',generateMessages('Admin','Welcome'));


        socket.broadcast.to(user.room).emit('message',generateMessages('Admin',`${user.username} has joined the chat!`))
        io.to(user.room).emit('roomdata',{
            room:user.room,
            users:getUserInRoom(user.room)
        })
        callback()
    })

    socket.on('sendMessage',(message,callback)=>{
        const filter = new Filter();
        const user = getUser(socket.id)
        if(filter.isProfane(message)){
            return callback('Bad Words not allowed!')
        }
        io.to(user.room).emit('message',generateMessages(user.username,message))

        /* -->fungsi callback ini cuman nyuruh client buat eksekusi fungsi nya /ngasih tau kalau server udah nerima fungsi callback */ callback()
    })

    socket.on('sendlocation',(location,callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage',generateLocationMessages(user.username,`https://google.com/maps/?q=${location.lat},${location.long}`))
        callback()
        
    })

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message',generateMessages('Admin',`${user.username} has left the chat`))
            io.to(user.room).emit('roomdata',{
                room:user.room,
                users:getUserInRoom(user.room)
            })
        }
    })
})

server.listen(port,()=>{
    console.log('Server is up on port',port);
});




