import React, { useEffect,useState } from 'react'
import  {user}  from "../Join/Join";
import socketIO from "socket.io-client";
import "./Chat.css";
import sendLogo from "../../images/send.png";
import Message from "../Message/Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
import closeIcon from "../../images/closeIcon.png";



let socket;

const ENDPOINT = 'http://localhost:4500/';

const Chat = () => {
    const [id,setId]= useState("");
    const [message,setMessage]= useState([])

    const send=()=>{
        const message= document.getElementById('chatInput').value;
        socket.emit('message',{message,id});
        document.getElementById('chatInput').value="";
    }

    console.log(message);
    useEffect(() => {
        socket = socketIO(ENDPOINT, { transports: ['websocket'] });


        socket.on('connect', () => {
            alert("connected");
            setId(socket.id);
        })
        console.log(socket);
        socket.emit('joined',{user})

        socket.on('welcome',(data)=>{
            setMessage([...message, data]);
            console.log(data.user,data.message);
        })

        socket.on('userJoined',(data)=>{
            setMessage([...message, data]);
            console.log(data.user,data.message);
        })

        socket.on('leave',(data)=>{
            setMessage([...message, data]);
            console.log(data.user,data.message);
        })

        return () => {
            socket.disconnect();
            socket.off();
            
        }
    }, [])


    useEffect(()=>{
        socket.on('sendMessage',(data)=>{
            setMessage([...message, data]);
            console.log(data.user,data.message,data.id);
        })

        return()=>{
        socket.off();
        }

    },[message])


    return (
        <div className='chatPage'>
            <div className='chatContainer'>
                <div className='header'> 
                <h2> CHAT APP </h2>
                <a href="/"> <img src={closeIcon} alt="Close" /> </a>
                </div>
                <ReactScrollToBottom className='chatBox'>
                    {message.map((item,i)=> <Message user={item.id===id?'': item.user} message={item.message}  classs={item.id===id?'right':'left'} /> )}
                </ReactScrollToBottom>
                <div className='inputBox'>

                    <input onKeyUp ={(event)=>event.key==='Enter'?send():null} type="text" id='chatInput' />
                    <button onClick={send} className='sendBtn'> <img src={sendLogo} alt='Send' /> </button>
                </div>

            </div>

        </div>
    )
}

export default Chat
