"use client";

import React, { useEffect, useState } from 'react'
import styles from "./singlePageContent.module.css";
import { numberFormat, timeSince } from '@/src/components/Format';

//Tools
import Image from 'next/image';
import Link from 'next/link';

//Access data
import { useSession } from 'next-auth/react';
import { fetcher } from '@/src/getData';
import useSWR from 'swr';

//Components
import Recommended from '../recommended/Recommended';
import Edit from '../edit/Edit';

//MUI Icons
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';

const SinglePageContent = ({ slug }) => {

    //Find user
    const session = useSession();
    const currentUser = session?.data?.user;

    //Data fetching
    const getData = () => {
        if(session?.status === 'authenticated'){
            const { data, mutate } = useSWR(
                `http://localhost:3000/api/posts/${slug}`,
                fetcher
            );
            return { data, mutate }
        }
    }

    const getPopular = (cat) => {
        const { data } = useSWR(
          `http://localhost:3000/api/popular?cat=${cat || ""}`,
          fetcher
        );
        return { data }
    }

    //Call data fetch functions
    const { data, mutate } = getData();
    const recommended  = getPopular(data?.catSlug);

    //Use states
    const [hideMenu, setHideMenu] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [like, setLike] = useState(data?.likes?.length);

    //Dynamic icons
    const LikeIcon = (isLiked) ? FavoriteIcon : FavoriteBorderIcon;
    const FollowIcon = (isFollowing) ? CheckCircleOutlineIcon : AddCircleOutlineIcon;

    //Use effects (Like and Follow)
    useEffect(()=>{
        setIsLiked(data?.likes?.includes(currentUser?.name));
    },[currentUser?.name, data?.likes])

    useEffect(()=>{
        setIsFollowing(data?.following?.includes(currentUser?.name));
    },[currentUser?.name, data?.following])

    //Handle Functions
    const handleLike = async() => {
        if(data){
            let updatedLikes = [...data.likes];
            let index = updatedLikes.findIndex((name) => name === currentUser?.name);
            (!updatedLikes.includes(currentUser?.name)) 
                ? (updatedLikes.push(currentUser?.name))
                : (updatedLikes.splice(index,1));
            const res = await fetch(`/api/posts/${slug}`, {
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

    const handleFollow = async() => {
        if(data){
            let updatedFollows = [...data.following];
            let index = updatedFollows.findIndex((name) => name === currentUser?.name);
            (!updatedFollows.includes(currentUser?.name)) 
                ? (updatedFollows.push(currentUser?.name))
                : (updatedFollows.splice(index,1));
            const res = await fetch(`/api/following`, {
                method: "PUT",
                body: JSON.stringify({
                    slug: slug,
                    array: updatedFollows,
                }),
            });
            if(res.status === 200){
                setIsFollowing(!isFollowing);
                mutate();
            }
        }
    }

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
                    <div className={styles.likeWrapper}>
                        <div 
                            className={(isLiked) ? styles.iconOn:styles.icon} 
                            onClick={handleLike}>
                            <LikeIcon />
                        </div>
                        {data?.likes?.length > 0 && <div className={styles.likes}>{numberFormat(data?.likes?.length)}</div>}
                    </div>
                    <div 
                        className={(isFollowing) ? styles.iconOn:styles.icon} 
                        onClick={handleFollow}>
                        <FollowIcon />
                    </div>
                    {(currentUser?.name === data?.userName) &&
                    <div className={styles.icon} onClick={()=>setShowEdit(true)}>
                        <EditIcon />
                    </div>}
                    {showEdit && <Edit post={data} setShowEdit={setShowEdit}/>}
                </div>
                <Link href={`/blog?cat=${data?.catSlug}`}>
                    <div className={styles.category}>{data?.catSlug}</div>
                </Link>
            </div>
        </div>
    </div>
    <div className={styles.content}>
        <div className={(!hideMenu && recommended?.data?.length > 1) ? styles.post:styles.postExtended}>
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
        {recommended?.data?.length > 1 &&
            <Recommended 
                currPost={data} 
                recommended={recommended?.data} 
                hideMenu={hideMenu} 
                setHideMenu={setHideMenu} 
            />
        }
    </div>
    </>
  )
}

export default SinglePageContent