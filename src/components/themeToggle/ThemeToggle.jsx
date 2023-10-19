"use client"

import React, { useContext } from 'react'
import styles from "./themeToggle.module.css";
import { ThemeContext } from '@/src/context/ThemeContext';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const ThemeToggle = () => {

  const { theme, toggle } = useContext(ThemeContext);

  return (
    <div 
      className={styles.container} 
      onClick={toggle}
      style={
        theme === "dark" 
        ? {backgroundColor: "white"}
        :{backgroundColor: "#0c0d11"}
      }>
      <div className={styles.icon}>
        <DarkModeIcon style={theme !== "dark" 
        ? {color: "white", fontSize:"15px"}
        :{color: "#0c0d11", fontSize:"15px"}}/>
      </div>
      <div 
        className={styles.circle} 
        style={theme === "dark" 
        ? {left: 1, backgroundColor: "#0c0d11"}
        :{right: 1, backgroundColor: "white"}
        }
      ></div>
      <div className={styles.icon}>
        <LightModeIcon style={theme !== "dark" 
        ? {color: "white", fontSize:"15px"}
        :{color: "#0c0d11", fontSize:"15px"}} />
      </div>
    </div>
  )
}

export default ThemeToggle