import { Avatar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from '../axios';
import './SidebarChat.css';
import { Link } from 'react-router-dom';
import {useStateValue} from '../StateProvider';

function SidebarChat({addNewChat, id, name}) {
    const [messages, setMessages] = useState([]);
    const [{token}, dispatch] = useStateValue();

    useEffect(() => {
        axios.get('/messages/sync', {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`
            }
        })
        .then(response => {
            const messages_filtered = response.data.filter(item => item.room === id);
            setMessages(messages_filtered);
        })
    }, [id]);

    const createChat = () => {
        const roomName = prompt("Please enter name for chat room");

        if (roomName) {
            axios.post('/rooms/new', {
                roomName: roomName
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${token}`
                }
            });
        }
    };

    return !addNewChat ? (
        <Link to={`/rooms/${id}`}>
            <div className='sidebarChat'>
                <Avatar />
                <div className='sidebarChat__info'>
                    <h2>{name}</h2>
                    <p>{messages[messages.length - 1]?.message}</p>
                </div>
            </div>
        </Link>
    ) : (
       <div onClick={createChat} className="sidebarChat">
        <h2>Add new chat</h2>
       </div> 
    );
}

export default SidebarChat;