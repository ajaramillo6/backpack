"use client";

import React, { useState } from 'react'
import styles from "./navbar.module.css";

//Tools
import { useSession } from 'next-auth/react';
import Link from 'next/link';

//Components
import AuthLinks from '../authLinks/AuthLinks';
import Suggestions from '../suggestions/Suggestions';

//MUI Icons
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

const Navbar = () => {

  //Find session
  const { data, status } = useSession();

  //Use states
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  //Handler function
  const handleOpenSearch = () => {
    setOpen(!open);
    setQ("");
  }

  return (
    <div className={styles.container}>
      <div className={!open ? styles.lookup : styles.lookupOn}>
        {!open ? (
          <SearchIcon style={{cursor:"pointer"}} onClick={handleOpenSearch} />
        ):(<div className={styles.searchInputWrapper}>
            <input 
              className={styles.input} 
              placeholder='Search'
              onChange={(e)=>setQ(e.target.value)}
              value={q} />
            <CloseIcon style={{cursor:"pointer"}} onClick={handleOpenSearch} />
            {q.length > 2 && <Suggestions q={q.toLowerCase()} setQ={setQ} />}
          </div>
        )}
      </div>
      <div className={!open ? styles.logo:styles.logoOut}>
        <Link className={styles.linkLogo} href='/'>
          backpack
        </Link>
      </div>
      <div className={!open ? styles.links:styles.linksOut}>
          <Link className={!open ? styles.link:styles.linkOut} href='/'>Home</Link> 
        {status === 'authenticated' &&
          <Link className={!open ? styles.link:styles.linkOut} href={`/following?user=${data?.user?.name}`}>Saved</Link>
        }
        <AuthLinks open={open} />
      </div>
    </div>
  )
}

export default Navbar