const socket = io()
//Elements
const $messageForm = document.querySelector('#message-form')
const $mesageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')

const $messages = document.querySelector('#messages')
const $location = document.querySelector('#location')
//elements//

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//templates

//Options

const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true})

//options
const autoscroll = ()=>{
    //new message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyle = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyle.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //visible height
    const visibleHeight = $messages.offsetHeight

    //height of messages container
    const containerHeight = $messages.scrollHeight

    //how far i have scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }


    console.log(newMessageMargin)
}
socket.on('message',(messages)=>{
    // console.log(messages)
    const html = Mustache.render(messageTemplate,{
        username:messages.username,
        messages : messages.text,
        createdAt: moment(messages.createdAt).format('h:mm A')
    })

    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')
    //disable the form
    const message = e.target.elements.message.value
    socket.emit('sendMessage',message,/* --> ngirim fungsi ke server atau sama dengan socket.on(fungsi)*/(error)=>{
        //enable
        $messageFormButton.removeAttribute('disabled')
        $mesageFormInput.value = ''
        $mesageFormInput.focus()
        //enable//
        if(error){return console.log(error)}
        console.log('the message has sent')
    })

})

socket.on('locationMessage',(locationMessages)=>{
    const html = Mustache.render(locationTemplate,{
        username:locationMessages.username,
        locationMessages : locationMessages.location,
        createdAt: moment(locationMessages.createdAt).format('h:mm A')
    })
    $messages.insertAdjacentHTML("beforeend", html)
    // console.log(locationMessages)
    autocsroll()
})

socket.on('roomdata',({room,users})=>{
    console.log(room)
    console.log(users)
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$locationButton.addEventListener('click',(e)=>{


    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }

    $locationButton.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendlocation',{lat:position.coords.latitude,long:position.coords.longitude},()=>{
            $locationButton.removeAttribute('disabled')
            console.log('Location has been shared!')
        })

    })

})
socket.emit('join',{username, room},(error)=>{
if(error){
    alert(error)
    location.href = '/'
}
})