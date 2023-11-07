"use client"

import React, { useState } from 'react'
import styles from "./authLinks.module.css";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AuthDropdown from '../authDropdown/AuthDropdown';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

const AuthLinks = ({ open }) => {

  const [openDropdown, setOpenDropdown] = useState(false);
  const [mouseInZone, setMouseInZone] = useState(false);

  const { status, data } = useSession();

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
        <Link className={styles.link} href={`/profile?user=${data?.user?.name}`} passHref>
          <div className={styles.profileNameWrapper}>
            <span className={styles.profileName}>{data?.user?.name}</span>
            <div className={styles.profilePicContainer}>
              <Image className={styles.profilePic} alt="" src={data?.user?.image} fill />
            </div>
          </div>
        </Link>
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