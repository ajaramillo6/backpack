"use client"

import React from 'react';
import styles from "./loginPage.module.css";
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

const LoginPage = () => {

  const { status } = useSession();

  const router = useRouter();

  if(status === "Loading"){
    return <div className={styles.loading}>Loading...</div>
  }
  if(status === "authenticated"){
    router.push("/");
  }
  return (
    <div className={styles.container}>
        <h1 className={styles.title}>Log In</h1>
        <div className={styles.wrapper}>
            <div className={styles.socialButton} onClick={()=>signIn("google")}>
                <GoogleIcon />
                <span>Continue with Google</span>
            </div>
            <div className={styles.socialButton}>
                <FacebookIcon />
                <span>Continue with Facebook</span>
            </div>
        </div>
    </div>
  )
}

export default LoginPage