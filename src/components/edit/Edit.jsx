"use client"
import React, { useEffect, useState } from 'react';
import styles from "./edit.module.css";
import { countryListAllIsoData } from '@/src/countries';

//Tools
import Image from 'next/image';

//Firebase tools
import { app } from '../../app/utils/firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

//Access data
import { fetcher } from '@/src/getData';
import useSWR from 'swr';

//Components
import Spinner from '../spinner/Spinner';
import Confirm from '../confirm/Confirm';
import CloseIcon from '@mui/icons-material/Close';


const storage = getStorage(app);

const Edit = ({ post, setShowEdit }) => {

    //Use states
    const [title, setTitle] = useState("");
    const [country, setCountry] = useState("");
    const [cat, setCat] = useState(null);
    const [file, setFile] = useState(null);
    const [media, setMedia] = useState("");
    const [progress, setProgress] = useState(0);
    const [confirm, setConfirm] = useState(false);

    //Fetch data
    const { isLoading, mutate } = useSWR(
        `http://localhost:3000/api/posts/${post.slug}`,
        fetcher
    );

    //Handle functions\
    const upload = () => {
      const uniqueName = new Date().getTime() + file.name;
      const storageRef = ref(storage, uniqueName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          switch (snapshot.state) {
            case 'paused':
              break;
            case 'running':
              setProgress(progress);
              break;
          }
        }, 
        (error) => {
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setMedia(downloadURL);
          });
        }
      );
    }
  
    const handleSave = async () => {
        //If replacing photo, then delete old before entering new
        if(post?.img && media){
            const storage = getStorage();
            const coverImg = post.img.split("/o/")[1].split("?")[0];
            const coverImgRef = ref(storage, coverImg.replaceAll("%20", " "));
            try{
                //Delete firebase data
                await deleteObject(coverImgRef).then(() => {
                        console.log("Img file deleted successfully")
                    }).catch((error) => {
                        console.log(error)
                    });
            } catch(err){
                console.log(err);
            }
        }
        //Post new edit
        const res = await fetch("/api/posts", {
            method: "PUT",
            body: JSON.stringify({
                title: title ? title:post.title,
                desc: post.desc,
                img: media ? media:post.img,
                country: (country && country !== 'Select country') ? country:post.country,
                catSlug: (cat && cat !== 'Select category *') ? cat:post.catSlug,
                slug: post.slug,
            }),
        });
        mutate();
        if(res.status === 200){
            setShowEdit(false);
        }
    };

    //Use effect
    useEffect(()=>{
        file && upload();
    },[file]);

  return (
    <div className={styles.container}>
        <div className={styles.subContainer}>
            <div className={styles.closeBtn} onClick={()=>setShowEdit(false)}>
                    <CloseIcon style={{fontSize:"16px"}} />
            </div>
            <div className={styles.wrapper}>
                <div className={styles.left}>
                    <h1>Edit Post</h1>
                    <div className={styles.textWrapper}>
                        <span className={styles.text}>Title</span>
                        <input 
                            className={styles.input} 
                            placeholder={post.title} 
                            type="text" 
                            onChange={(e)=>setTitle(e.target.value)}
                        />
                    </div>
                    <div className={styles.textWrapper}>
                        <span className={styles.text}>Category: {post.catSlug}</span>
                    </div>
                    <div className={styles.textWrapper}>
                        <span className={styles.text}>New Category</span>
                        <select 
                            className={styles.select} 
                            onChange={(e)=>setCat(e.target.value)}>
                                <option value="Select category">Select category *</option>
                                <option value="tropical">tropical</option>
                                <option value="ocean view">ocean view</option>
                                <option value="national park">national park</option>
                                <option value="city lights">city lights</option>
                                <option value="mountains">mountains</option>
                                <option value="rivers">rivers</option>
                                <option value="lake life">lake life</option>
                                <option value="dessert">dessert</option>
                        </select>
                    </div>
                    <div className={styles.textWrapper}>
                        <span className={styles.text}>Country: {post.country}</span>
                    </div>
                    <div className={styles.textWrapper}>
                        <span className={styles.text}>New Country</span>
                        <select 
                            className={styles.select} 
                            onChange={(e)=>setCountry(e.target.value)}>
                            {countryListAllIsoData.map((country)=>(
                                <option key={country.code} value={country.name}>{country.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.splitWrapper}>
                        <span className={styles.text}>Cover photo</span>
                        {(file && progress > 0 && progress < 100) && <Spinner />}
                    </div>
                    {(!file) ? (<>
                        {post?.img ? (
                        <div className={styles.imgWrapper}>
                            <Image className={styles.img} src={post.img} alt="" fill />
                        </div>):(
                        <div style={{color:"gray", fontSize:"14px"}}>
                            Cover photo does not exist
                        </div>)
                        }
                        </>):(<>
                        {(progress > 0 && progress < 100) ? (
                            <div className={styles.imgWrapper}>
                                <span className={styles.progress}>Uploading: {progress.toFixed(0) + "%"}</span>
                            </div>
                        ):(
                            <div className={styles.imgWrapper}>
                                <Image className={styles.img} src={media} alt="" fill />
                            </div>
                        )
                        }
                        </>)
                    }
                    <label htmlFor="img">
                        <span className={styles.editBtn}>Edit</span>
                        <input 
                            type="file"
                            accept=".jpeg, .jpg, .png"
                            style={{display: "none"}}
                            id="img"
                            name="img"
                            onChange={(e)=>setFile(e.target.files[0])}
                        />
                    </label>
                </div>
            </div>
            <div className={styles.btnsWrapper}>
                <button 
                    className={styles.saveBtn} 
                    onClick={handleSave}>
                        {!isLoading ? "Save":<Spinner />}
                </button>
                <button 
                    className={styles.deleteBtn} 
                    onClick={()=>setConfirm(true)}>
                        Delete
                </button>
            </div>
            {confirm &&
            <Confirm 
                post={post} 
                setConfirm={setConfirm}
                message="Are you absolutely sure?"
                subText="This action will permanently delete your post." 
            />}
        </div>
    </div>
  )
}

export default Edit