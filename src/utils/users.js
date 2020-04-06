const users = []

const addUser = ({id,username,room})=>{
    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //check if username and room aren't empty
    if(!username || !room){
        return {
            error: 'Username and room are required'
        }
    }

    //check existing user
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    //check if user use duplicate username
    if(existingUser){
        return {
            error: 'Username is in use!'
        }
    }

    //add user
    const user = {id,username,room}
    users.push(user)
    return{user}
}

const removeUser = (id)=>{
    const index = users.findIndex((user)=>user.id === id)

    if(index !==-1){
        return users.splice(index,1)[0] //hapus data di array users,di index ke 'index',menghapus 1 item,kemudian pilih berapa item yang akan di return dari []
    }
}

const getUser = (id)=>{
    return users.find((user=> user.id === id))
}

const getUserInRoom = (room)=>{
    room = room.trim().toLowerCase()
    const findroom = users.filter((user=>user.room===room))

    if(findroom){
        return findroom
    }
}

module.exports = {
    addUser,
    removeUser,
    getUserInRoom,
    getUser
}