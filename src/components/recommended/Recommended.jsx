"use client";

import React, { useState } from 'react'
import styles from "./recommended.module.css";
import Card from '../card/Card';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

const Recommended = ({ currPost, recommended, hideMenu, setHideMenu }) => {

    const [showMore, setShowMore] = useState(false);

    const handleShowMore = () => {
        setShowMore(!showMore);
    }

  return (
    <div className={!hideMenu ? styles.container:styles.containerHide}>
        <div className={styles.header}>
            <div className={styles.leftHeader}>
                <h2 className={styles.title}>Related Posts</h2>
            </div>
            <div className={styles.iconWrapper} onClick={()=>setHideMenu(true)}>
                <KeyboardDoubleArrowRightIcon />
            </div>
        </div>
        <div className={styles.cardsWrapper}>
            {showMore ?
            <>
            {recommended?.filter((post)=>post.catSlug === currPost.catSlug && (post.id !== currPost.id)).map((post)=>(
                <Card post={post} type="recommendations" key={post._id} />
            ))}
            </>:<>
            {recommended?.filter((post)=>post.catSlug === currPost.catSlug && (post.id !== currPost.id)).map((post)=>(
                <Card post={post} type="recommendations" key={post._id} />
            )).slice(0,5)}
            </>}
        </div>
        {recommended?.length > 6 &&
        <div className={styles.showMoreBtn} onClick={handleShowMore}>
            <span>{showMore ? "Show Less":"Show more"}</span>
            {showMore ? <KeyboardDoubleArrowUpIcon style={{fontSize:"18px"}} />:<KeyboardDoubleArrowDownIcon style={{fontSize:"18px"}} />}
        </div>}
    </div>
  )
}

export default Recommended