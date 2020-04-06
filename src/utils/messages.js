const generateMessages = (username,text)=>{
    return {
        username,
        text:text,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessages = (username,location)=>{
    return {
        username,
        location,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessages,
    generateLocationMessages
}