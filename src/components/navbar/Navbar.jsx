"use client"

import React, { useState } from 'react'
import styles from "./navbar.module.css";
import Link from 'next/link';
import AuthLinks from '../authLinks/AuthLinks';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import Suggestions from '../suggestions/Suggestions';
import { useSession } from 'next-auth/react';

const Navbar = () => {

  const { data, status } = useSession();

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const handleOpenSearch = () => {
    setOpen(!open);
    setQ("");
  }

  return (
    <div className={styles.container}>
      {status === 'authenticated' && 
      <div className={!open ? styles.lookup : styles.lookupOn}>
        {!open
        ? <SearchIcon style={{cursor:"pointer"}} onClick={handleOpenSearch} />
        : <div className={styles.searchInputWrapper}>
            <input 
              className={styles.input} 
              placeholder='Search'
              onChange={(e)=>setQ(e.target.value)}
              value={q} />
            <CloseIcon style={{cursor:"pointer"}} onClick={handleOpenSearch} />
            {q.length > 2 && <Suggestions q={q.toLowerCase()} setQ={setQ} />}
          </div>
        }
      </div>}
      <div className={!open ? (status === 'authenticated' ? styles.logo:styles.logoLogout):styles.logoOut}>
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