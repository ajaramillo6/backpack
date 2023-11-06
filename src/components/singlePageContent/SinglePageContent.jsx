"use client";

import React, { useEffect, useState } from 'react'
import styles from "./singlePageContent.module.css";
import Image from 'next/image';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import { numberFormat, timeSince } from '@/src/components/Format';
import Recommended from '../recommended/Recommended';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import Edit from '../edit/Edit';
import useSWR from 'swr';
import { fetcher } from '@/src/getData';
import Spinner from '../spinner/Spinner';
import { useSession } from 'next-auth/react';

const SinglePageContent = ({ post, recommended }) => {

    const getData = () => {
        const { data, mutate, isLoading } = useSWR(
            `http://localhost:3000/api/posts/${post.slug}`,
            fetcher
        );
        return { data, mutate, isLoading }
    }

    const { data, mutate, isLoading } = getData();

    const session = useSession();
    const currentUser = session?.data?.user;

    const [hideMenu, setHideMenu] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [like, setLike] = useState(data?.likes?.length);

    const handleLike = async() => {
        if(data){
            let updatedLikes = [...data.likes];
            let index = updatedLikes.findIndex((email) => email === currentUser?.email);
            (!updatedLikes.includes(currentUser?.email)) 
                ? (updatedLikes.push(currentUser?.email))
                : (updatedLikes.splice(index,1));
            const res = await fetch(`/api/posts/${post.slug}`, {
                method: "PUT",
                body: JSON.stringify(
                updatedLikes
                ),
            });
            if(res.status === 200){
                setLike(isLiked ? like - 1 : like + 1);
                setIsLiked(!isLiked);
                mutate();
            }
        }
    }

    const LikeIcon = (isLiked) ? FavoriteIcon : FavoriteBorderIcon;

    //Like Track
    useEffect(()=>{
        setIsLiked(data?.likes?.includes(currentUser?.email));
    },[currentUser?.email, data?.likes])

  return (
    <>
        {isLoading
        ? <div className={styles.infoContainer}><Spinner /></div>
        :<>
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
                        <div className={styles.likeWrapper}>
                            <div 
                                className={(isLiked) ? styles.iconLiked:styles.icon} 
                                onClick={handleLike}>
                                <LikeIcon />
                            </div>
                            {data?.likes?.length > 0 && <div className={styles.likes}>{numberFormat(data?.likes?.length)}</div>}
                        </div>
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
        </>}
    </>
  )
}

export default SinglePageContent