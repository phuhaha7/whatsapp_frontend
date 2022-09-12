import { useEffect, useState} from 'react';
import Pusher from 'pusher-js';
import './App.css';
import Chat from './components/Chat';
import Sidebar from './components/Sidebar';
import Login from './Login';
import axios from './axios';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import { useStateValue} from './StateProvider';
import Home from './components/Home';

function App() {
  const [{ user }, dispatch] = useStateValue();

  return (
    <div className="app">

      {!user ? (
        <Login />
      ) : (
        <div className='app__body'>
        <Router>
        <Sidebar />
          <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/rooms/:roomId' element={<Chat />} />
          </Routes>
        </Router>
      </div>
      )} 
    </div>
  );
}

export default App;
