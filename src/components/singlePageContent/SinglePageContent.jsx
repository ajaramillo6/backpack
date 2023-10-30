"use client";

import React, { useState } from 'react'
import styles from "./singlePageContent.module.css";
import Image from 'next/image';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import { numberFormat, timeSince } from '@/src/components/Format';
import Recommended from '../recommended/Recommended';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import Edit from '../edit/Edit';

const SinglePageContent = ({ data, recommended }) => {

    const [hideMenu, setHideMenu] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

  return (
    <>
        <div className={styles.infoContainer}>
            {data?.img &&
            <div className={styles.imageContainer}>
                <Image src={data.img} alt="" fill className={styles.image} />
            </div>}
            <div className={data?.img ? styles.textContainer:styles.textFullContainer}>
                <h1 className={styles.title}>{data?.title}</h1>
                <div className={styles.infoWrapper}>
                    <div className={styles.userInfoWrapper}>
                        {data?.user?.image &&
                        <div className={styles.userImageContainer}>
                            <Image src={data.user.image} alt="" fill className={styles.avatar} />
                        </div>}
                        <div className={styles.userTextContainer}>
                            <span className={styles.username}>{data?.user?.name}</span>
                            <span className={styles.date}>{timeSince(new Date(Date.now())-new Date(data?.createdAt))}</span>
                        </div>
                    </div>
                    <div className={styles.iconsContainer}>
                        <div className={styles.icon}>
                            <FavoriteBorderIcon />
                        </div>
                        <div className={styles.likes}>{numberFormat(data?.likes)} likes</div>
                        <div className={styles.icon}>
                            <AddCircleOutlineIcon />
                        </div>
                        <div className={styles.icon} onClick={()=>setShowEdit(true)}>
                            <EditIcon />
                        </div>
                        {showEdit && <Edit post={data} setShowEdit={setShowEdit}/>}
                    </div>
                    <div className={styles.category}>{data?.catSlug}</div>
                </div>
            </div>
        </div>
        <div className={styles.content}>
            <div className={(!hideMenu && recommended?.length > 1) ? styles.post:styles.postExtended}>
                <div 
                    className={styles.desc} 
                    dangerouslySetInnerHTML={{ __html:data?.desc }} 
                />
            </div>
            <div className={styles.postSmScreen}>
                <div 
                    className={styles.desc} 
                    dangerouslySetInnerHTML={{ __html:data?.desc }} 
                />
            </div>
            {hideMenu && <>
                <div className={styles.onHideSidbar}>
                    <div className={styles.iconWrapper} onClick={()=>setHideMenu(false)}>
                        <KeyboardDoubleArrowLeftIcon />
                    </div>
                </div>
            </>}
            {recommended?.length > 1 &&
                <Recommended 
                    currPost={data} 
                    recommended={recommended} 
                    hideMenu={hideMenu} 
                    setHideMenu={setHideMenu} 
                />
            }
        </div>
    </>
  )
}

export default SinglePageContent