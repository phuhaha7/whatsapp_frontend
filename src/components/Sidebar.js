import React, { useEffect, useState } from 'react';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import SearchIcon from '@mui/icons-material/Search';
import axios from '../axios';
import Pusher from 'pusher-js';
import { useStateValue } from '../StateProvider';

import './Sidebar.css';
import { Avatar, IconButton } from '@mui/material';
import SidebarChat from './SidebarChat';

function Sidebar() {
    const [rooms, setRooms] = useState([]);
    const [{user, token}, dispatch] = useStateValue();

    useEffect(() => {
        axios.get('/rooms/sync', {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`
            }
        })
            .then(response =>
                setRooms(response.data)
            );
    },[]);


    useEffect(() => {
        const pusher = new Pusher('3360ed329febe553ff3e', {
        cluster: 'us2'
        });

        var channel = pusher.subscribe('room');
        channel.bind('inserted', (data) => {
        //alert(JSON.stringify(data));
        setRooms([...rooms, data]);
        });

        // clean up function, prevent use effect running more than
        return () => {
        channel.unbind_all();
        channel.unsubscribe();
        };

    }, [rooms]);

    return (
        <div className='sidebar'>
            <div className='sidebar__header'>
            <Avatar src={user?.photoURL}/>
                <div className='sidebar_headerRight'>
                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>

            <div className='sidebar__search'>
                <div className='sidebar__searchContainer'>
                    <SearchIcon />
                    <input placeholder='Search or start new chat' type='text'/>
                </div>
            </div>

            <div className='sidebar__chats'>
                <SidebarChat addNewChat={true} />
                {rooms.map(room => 
                    <SidebarChat key={room._id} id={room._id} name={room.roomName}/>
                )}
            </div>
        </div>
    );
}

export default Sidebar;