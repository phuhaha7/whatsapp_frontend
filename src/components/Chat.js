import { Avatar, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import React, { useState, useEffect } from 'react';
import './Chat.css'
import MoreVert from '@mui/icons-material/MoreVert';
import MicIcon from '@mui/icons-material/Mic';
import axios from '../axios';
import { useParams } from 'react-router-dom';
import Pusher from 'pusher-js';
import {useStateValue} from '../StateProvider';

function Chat() {
    const [input, setInput] = useState("");
    const { roomId } = useParams();
    const [roomName, setRoomName] = useState("");
    const [{user, token}, dispatch] = useStateValue();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (roomId) {
        axios.get(`/rooms/sync/${roomId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`
            }
        })
            .then(response => {
                setRoomName(response.data.roomName);
            });
        }
    }, [roomId]);

    const sendMessage = async (e) => {
        e.preventDefault();
        
        await axios.post('/messages/new', {
            message: input,
            name: `${user.displayName}`,
            timestamp: new Date().toISOString(),
            received: true,
            room: roomId
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`
            }
        });
        setInput('');
    }

    useEffect(() => {
        axios.get('/messages/sync', {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`
            }
        })
        .then(response => {
            const messages_filtered = response.data.filter(item => item.room === roomId);
            setMessages(messages_filtered);
        })
    }, [roomId]);


    useEffect(() => {
        const pusher = new Pusher('3360ed329febe553ff3e', {
        cluster: 'us2'
        });

        var channel = pusher.subscribe('message');
        channel.bind('inserted', (data) => {
        //alert(JSON.stringify(data));
        setMessages([...messages, data]);
        });

        // clean up function, prevent use effect running more than
        return () => {
        channel.unbind_all();
        channel.unsubscribe();
        };

  }, [messages]);

    return (
        <div className='chat'>
            <div className='chat__header'>
                <Avatar />

                <div className='chat__headerInfo'>
                    <h3>{roomName}</h3>
                    <p>Last seen{" "}
                        {new Date(
                            messages[messages.length - 1]?.timestamp
                        ).toUTCString()}
                    </p> 
                </div>

                <div className='chat__headerRight'>
                    <IconButton>
                        <SearchIcon />
                    </IconButton>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>

            <div className='chat__body'>
                {messages.map((message) => 
                    <p className={`chat__message ${message.name === user.displayName && 'chat__receiver'}`}>
                        <span className='chat__name'>{message.name}</span>
                        {message.message}
                        <span className='chat__timestamp'>
                            {message.timestamp}
                        </span>
                    </p> 
                )}
            </div>

            <div className='chat__footer'>
                <SentimentSatisfiedAltIcon />
                <form>
                    <input 
                        onChange={e => setInput(e.target.value)}
                        value={input}
                        placeholder="Type a message"
                        type="text"
                    />
                    <button onClick={sendMessage} type="submit">
                        Send message
                    </button>
                </form>
                <MicIcon />
            </div>
        </div>
    );
}

export default Chat;