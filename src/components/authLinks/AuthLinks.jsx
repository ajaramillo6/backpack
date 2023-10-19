"use client"

import React, { useState } from 'react'
import styles from "./authLinks.module.css";
import Link from 'next/link';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AuthDropdown from '../authDropdown/AuthDropdown';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const AuthLinks = ({ open }) => {

  const [openDropdown, setOpenDropdown] = useState(false);
  const [mouseInZone, setMouseInZone] = useState(false);

  const { status, data } = useSession();

  const handleBlur = () => {
    !mouseInZone && setMouseInZone(false)
  }

  return (<>
  {status === 'unauthenticated' ? (
    <Link href="/login">
      <div className={styles.btn}>
        <PersonOutlineIcon style={{fontSize: "22px"}} />
        Login
      </div>
    </Link>
  ):(
    <>
      <div className={!open ? styles.profile:styles.profileOut}>
        <span className={styles.profileName}>{data?.user?.name}</span>
        <div className={styles.profilePicContainer}>
          <Image className={styles.profilePic} alt="" src={data?.user?.image} fill />
        </div>
        <div 
          className={
            openDropdown 
          ? styles.iconActive
          :styles.icon} 
          onClick={()=>setOpenDropdown(!openDropdown)}
          onMouseEnter={()=>setMouseInZone(true)}
          onMouseLeave={()=>setMouseInZone(false)}
          onBlur={handleBlur}
          tabIndex="0">
          <ArrowDropDownIcon style={{fontSize: "22px"}} />
        </div>
        {openDropdown && 
          <AuthDropdown 
            setOpen={setOpenDropdown} 
            setMouseInZone={setMouseInZone}
          />
        }
      </div>
    </>
  )}
  </>)
}

export default AuthLinks