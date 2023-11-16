"use client";

import React, { useState } from 'react';
import styles from './noUser.module.css';

//Components
import Spinner from '../spinner/Spinner';

//Tools
import { signIn } from 'next-auth/react';

//MUI Icons
import GoogleIcon from '@mui/icons-material/Google';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NoUser = () => {

    //Use state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    //Handle function
    const handleSignIn = async() => {
      try{
        setLoading(true);
        setError(false);
        await signIn("google");
      }catch(err){
        setLoading(false);
        setError(true);
        console.log(err);
      }
    }

  return (
    <div className={styles.container}>
        <div className={styles.subContainer}>
            <h1>Login</h1>
            <p className={styles.message}>Log into your Backpack account to view content</p>
            {loading 
                ? <Spinner />
                : <div className={styles.link} onClick={handleSignIn}>
                    <GoogleIcon style={{fontSize: "18px"}} />
                    <span>Log in with Google</span>
                </div>
            }
            {error &&
                <span className={styles.errorWrapper}>
                    <ErrorOutlineIcon />
                    <p className={styles.errorText}>Something went wrong!</p>
                </span>
            }
        </div>
    </div>
  )
}

export default NoUser