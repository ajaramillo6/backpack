"use client"

import React, { useState } from 'react'
import styles from "./authLinks.module.css";

//Tools
import { useSession } from 'next-auth/react';
import Image from 'next/image';

//MUI Icons
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AuthDropdown from '../authDropdown/AuthDropdown';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

const AuthLinks = ({ open }) => {

  //Use states
  const [openDropdown, setOpenDropdown] = useState(false);
  const [mouseInZone, setMouseInZone] = useState(false);

  //Find user
  const { status, data } = useSession();

  //Handle function
  const handleBlur = () => {
    !mouseInZone && setMouseInZone(false)
  }

  return (<>
  {status === 'unauthenticated' ? (
    <div className={styles.btnContainer}>
      <div className={styles.btn} onClick={()=>setOpenDropdown(!openDropdown)}>
        <PersonOutlineIcon style={{fontSize: "22px"}} />
        Login
      </div>
      {openDropdown && 
        <AuthDropdown 
          setOpen={setOpenDropdown} 
          setMouseInZone={setMouseInZone}
        />
      }
    </div>
  ):(
    <>
      <div className={!open ? styles.profile:styles.profileOut}>
        <div className={styles.profileNameWrapper}>
          <span className={styles.profileName}>{data?.user?.name}</span>
          <div className={styles.profilePicContainer}>
            <Image className={styles.profilePic} alt="" src={data?.user?.image} fill />
          </div>
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