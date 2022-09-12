import { Button } from '@mui/material';
import {auth, provider} from './firebase';
import { signInWithPopup } from 'firebase/auth';
import React from 'react';
import './Login.css';
import { actionTypes } from './reducer';
import { useStateValue } from './StateProvider';
import axios from './axios';

function Login() {
    const [{}, dispatch] = useStateValue();

    const signIn = () => {
        signInWithPopup(auth, provider)
        .then(result => {
            dispatch({
                type: actionTypes.SET_USER,
                user: result.user
            });
        })
        .catch(error => alert(error.message));

        auth.currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
            // Send token to your backend via HTTPS
            // ...
           
            axios.post('authenticate', {}, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `${idToken}`
                }
            }).then(response => {
                dispatch({
                    type: "SET_TOKEN",
                    token: response.data
                })
            });

          })
          .catch(function(error) {
            // Handle error
            alert(error.message);
        });
    }

    return (
        <div className='login'>
            <div className='login__container'>
                <img 
                    src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1024px-WhatsApp.svg.png'
                    alt=''
                />

                <div className='login__text'>
                    <h1>Sign in to WhatsApp</h1>
                </div>

                <Button type='submit' onClick={signIn}>
                    Sign in with Google
                </Button>
            </div>
        </div>
    );
}

export default Login;