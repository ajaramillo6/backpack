"use client"

import React, { useState } from 'react'
import styles from "./navbar.module.css";
import Link from 'next/link';
import AuthLinks from '../authLinks/AuthLinks';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

const Navbar = () => {

  const [open, setOpen] = useState(false);

  const handleOpenSearch = () => {
    setOpen(!open)
  }

  return (
    <div className={styles.container}>
      <div className={!open ? styles.lookup : styles.lookupOn}>
        {!open
        ? <SearchIcon style={{cursor:"pointer"}} onClick={handleOpenSearch} />
        : <div className={styles.searchInputWrapper}>
            <input className={styles.input} placeholder='Search' />
            <CloseIcon style={{cursor:"pointer"}} onClick={handleOpenSearch} />
            <SearchIcon style={{cursor:"pointer"}} />
          </div>
        }
      </div>
      <div className={!open ? styles.logo:styles.logoOut}>
        <Link className={styles.linkLogo} href='/'>
          backpack
        </Link>
      </div>
      <div className={!open ? styles.links:styles.linksOut}>
        <Link className={!open ? styles.link:styles.linkOut} href='/'>Home</Link>
        <Link className={!open ? styles.link:styles.linkOut} href='/'>Saved</Link>
        <AuthLinks open={open} />
      </div>
    </div>
  )
}

export default Navbar