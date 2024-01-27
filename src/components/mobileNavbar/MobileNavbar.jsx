"use client"
import React, { useEffect, useState } from 'react'
import styles from "./mobileNavbar.module.css";

//Tools
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

//MUI Icons
import HomeIcon from '@mui/icons-material/Home';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import EditNoteIcon from '@mui/icons-material/EditNote';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LogoutIcon from '@mui/icons-material/Logout';
import useSWR from 'swr';
import { fetcher } from '@/src/getData';

const MobileNavbar = () => {

  //Find session
  const { data, status } = useSession();

  const page = 1;
  const userName = data?.user?.name;
  const userEmail = data?.user?.email;

  const drafts = useSWR(
    `https://backpack-links.vercel.app/api/drafts?user=${userName}&page=${page}`,
    fetcher
  );

  const [authorized, setAuthorized] = useState(false);

  useEffect(()=>{
    if((userEmail === 'megandunnavant4@gmail.com') || (userEmail === 'laurenjdunnavant@gmail.com')){
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }
  },[userEmail])

  const handleSignOut = async() => {
    try{
      await signOut();
    }catch(err){
      console.log(err);
    }
  }
  
  return (
    <div className={status === 'authenticated' ? styles.container:styles.containerLoggedOut}>
      <div className={styles.wrapper}>
        <Link className={styles.link} href='/'>
          <div className={styles.icon}>
            <HomeIcon />
          </div>
        </Link>
        {authorized && (<>
          <Link className={styles.link} href='/write'>
            <div className={styles.icon}>
              <NewspaperIcon />
            </div>
          </Link>
          <Link className={styles.link} href={`/drafts?user=${data?.user?.name}`} passHref>
          {drafts?.data?.count > 0
            ? <div className={styles.draftMobile}>{drafts?.data?.count}</div>
            :<div className={styles.icon}>
              <EditNoteIcon style={{fontSize:"27px"}} />
            </div>
          }
          </Link>
        </>)}
        {status === 'authenticated' &&
        <Link className={styles.link} href={`/following?user=${data?.user?.name}`} passHref>
          <div className={styles.icon}>
            <BookmarkIcon />
          </div>
        </Link>
        }
        <div className={styles.icon} onClick={handleSignOut}>
          <LogoutIcon />
        </div>
      </div>
    </div>
  )
}

export default MobileNavbar