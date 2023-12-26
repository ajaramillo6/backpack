"use client";

import React, { useEffect, useState } from 'react'
import styles from "./singlePageContent.module.css";
import { numberFormat, timeSince } from '@/src/components/Format';

//Tools
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

//Access data
import { useSession } from 'next-auth/react';
import { fetcher } from '@/src/getData';
import useSWR from 'swr';

//MUI Icons
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';

//Components
import Recommended from '../recommended/Recommended';
import Edit from '../edit/Edit';
import Editor from '../editor/Editor';

const SinglePageContent = ({ slug }) => {

    const router = useRouter();

    //Find user
    const session = useSession();
    const currentUser = session?.data?.user;

    //Data fetching
    const getData = () => {
        const { data, mutate } = useSWR(
            `http://localhost:3000/api/posts/${slug}`,
            fetcher
        );
        return { data, mutate }
    }

    const getPopular = (cat) => {
        const { data } = useSWR(
        `http://localhost:3000/api/popular?cat=${cat || ""}`,
        fetcher
        );
        return { data }
    }

    //Call data fetch functions
    const item = getData();
    const recommended  = getPopular(item?.data?.catSlug);

    //Use states
    const [hideMenu, setHideMenu] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [like, setLike] = useState(item?.data?.likes?.length);
    const [updateMode, setUpdateMode] = useState(false);
    const [value, setValue] = useState("");

    //Dynamic icons
    const LikeIcon = (isLiked) ? FavoriteIcon : FavoriteBorderIcon;
    const FollowIcon = (isFollowing) ? CheckCircleOutlineIcon : AddCircleOutlineIcon;

    //Use effects
    useEffect(()=>{
        setIsLiked(item?.data?.likes?.includes(currentUser?.name));
    },[currentUser?.name, item?.data?.likes])

    useEffect(()=>{
        setIsFollowing(item?.data?.following?.includes(currentUser?.name));
    },[currentUser?.name, item?.data?.following])

    useEffect(() => {
        setValue(item?.data?.desc);
    }, [item?.data?.desc]);

    //Handle Functions
    const handleLike = async() => {
        if(session?.status === "unauthenticated"){
            router.push("/?user=undefined");
        };
        if(item?.data){
            let updatedLikes = [...item?.data?.likes];
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
                item?.mutate();
            }
        }
    }

    const handleFollow = async() => {
        if(session?.status === "unauthenticated"){
            router.push("/?user=undefined");
        };
        if(item?.data){
            let updatedFollows = [...item?.data?.following];
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
                item?.mutate();
            }
        }
    }

    const handleDoubleClick = (e) => {
        if(session?.status === "unauthenticated"){
            router.push("/?user=undefined");
        };
        switch (e.detail) {
            case 1:
              break;
            case 2:
              setUpdateMode(true);
              break;
            case 3:
              break;
          }
    }

    const handleSaveEdit = async() => {
        if(session?.status === "unauthenticated"){
            router.push("/?user=undefined");
        };
        //Post new edit
        const res = await fetch("/api/posts", {
            method: "PUT",
            body: JSON.stringify({
                desc: item?.data?.title,
                desc: value,
                img: item?.data?.img,
                country: item?.data?.country,
                catSlug: item?.data?.catSlug,
                slug: item?.data?.slug,
                published: item?.data?.published,
            }),
        });
        item?.mutate();
        if(res.status === 200){
            setUpdateMode(false);
        }
    }

    const handlePublish = async () => {
        if(session?.status === "unauthenticated"){
            router.push("/?user=undefined");
        };
        //Publish
        const res = await fetch("/api/posts", {
            method: "PUT",
            body: JSON.stringify({
                desc: item?.data?.title,
                desc: item?.data?.desc,
                img: item?.data?.img,
                country: item?.data?.country,
                catSlug: item?.data?.catSlug,
                slug: item?.data?.slug,
                published: true,
            }),
        });
        item?.mutate();
        if(res.status === 200){
            router.push("/");
        }
    };

  return (
    <>
    {!updateMode && (<>
        {!item?.data?.published &&
            <div className={styles.draftBlock}>
                <span>This page is currently a draft.</span>
                <button className={styles.publishBtn} onClick={handlePublish}>Publish</button>
            </div>
        }
        <div className={styles.infoContainer}>
            {item?.data?.img &&
            <div className={styles.imageContainer}>
                <Image 
                    src={item?.data.img} 
                    alt="" 
                    fill 
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, 33vw" 
                />
            </div>}
            <div className={item?.data?.img ? styles.textContainer:styles.textFullContainer}>
                <h1 className={styles.title}>{item?.data?.title}</h1>
                <div className={styles.infoWrapper}>
                    <div className={styles.userInfoWrapper}>
                        {item?.data?.user?.image &&
                        <div className={styles.userImageContainer}>
                            <Image 
                                src={item?.data?.user.image} 
                                alt="" 
                                fill 
                                className={styles.avatar} 
                            />
                        </div>}
                        <div className={styles.userTextContainer}>
                            <span className={styles.username}>{item?.data?.user?.name}</span>
                            <span className={styles.date}>{timeSince(new Date(Date.now())-new Date(item?.data?.createdAt))}</span>
                        </div>
                    </div>
                    <div className={styles.iconsContainer}>
                        {item?.data?.published && (<>
                            <div className={styles.likeWrapper}>
                                <div 
                                    className={(isLiked) ? styles.iconOn:styles.icon} 
                                    onClick={handleLike}>
                                    <LikeIcon />
                                </div>
                                {item?.data?.likes?.length > 0 && <div className={styles.likes}>{numberFormat(item?.data?.likes?.length)}</div>}
                            </div>
                            <div 
                                className={(isFollowing) ? styles.iconOn:styles.icon} 
                                onClick={handleFollow}>
                                <FollowIcon />
                            </div>
                        </>)}
                        {(currentUser?.name === item?.data?.userName) &&
                        <div className={styles.icon} onClick={()=>setShowEdit(true)}>
                            <EditIcon />
                        </div>}
                        {showEdit && 
                            <Edit 
                                post={item?.data} 
                                setShowEdit={setShowEdit}
                            />
                        }
                    </div>
                    <Link href={`/blog?cat=${item?.data?.catSlug}`}>
                        <div className={styles.category}>{item?.data?.catSlug}</div>
                    </Link>
                </div>
            </div>
        </div>
    </>)}
    {updateMode ? (
        <div className={styles.postEditContent}>
            <h1 className={styles.editHeader}>Edit Content</h1>
            <div className={styles.btnsWrapper}>
                <button className={styles.cancelBtn} onClick={()=>setUpdateMode(false)}>Cancel</button>
                <button className={styles.saveBtn} onClick={handleSaveEdit}>Save</button>
            </div>
            <Editor value={value} setValue={setValue} />
        </div>
    ):(
        <div className={styles.content}>
            <div 
                className={(!hideMenu && recommended?.data?.length > 1) 
                    ? styles.post 
                    : styles.postExtended
                } 
                onClick={(currentUser?.name === item?.data?.userName) && handleDoubleClick} >
                <div 
                    className="ql-editor"
                    dangerouslySetInnerHTML={{ __html:item?.data?.desc }} 
                />
                {(currentUser?.name === item?.data?.userName) &&
                    <div className={styles.doubleClickNotify}>
                        <span>Double click to edit content</span>
                    </div>
                }
            </div>
            <div className={styles.postSmScreen}>
                <div 
                    className="ql-editor"
                    dangerouslySetInnerHTML={{ __html:item?.data?.desc }} 
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
                    currPost={item?.data} 
                    recommended={recommended?.data} 
                    hideMenu={hideMenu} 
                    setHideMenu={setHideMenu} 
                />
            }
        </div>
    )}
    </>
  )
}

export default SinglePageContent