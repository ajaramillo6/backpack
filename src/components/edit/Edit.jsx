"use client"
import React, { useEffect, useState } from 'react'
import styles from "./edit.module.css";
import { useRouter } from 'next/navigation';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from '../../app/utils/firebase'
import { countryListAllIsoData } from '@/src/countries';
import ProgressBar from '../progressBar/ProgressBar';

const storage = getStorage(app);

const Edit = ({ post, setShowEdit }) => {

    const router = useRouter();

    const [title, setTitle] = useState("");
    const [country, setCountry] = useState("");
    const [cat, setCat] = useState(null);
    const [file, setFile] = useState(null);
    const [media, setMedia] = useState("");
    const [progress, setProgress] = useState(0);

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
  
    useEffect(()=>{
      file && upload();
    },[file]);
  
    const handleSave = async () => {
      const res = await fetch("/api/posts", {
        method: "PUT",
        body: JSON.stringify({
          title: title ? title:post.title,
          desc: post.desc,
          img: media ? media:post.img,
          country: (country !== 'Select country') && country,
          catSlug: (cat !== 'Select category *') && cat,
          slug: post.slug,
        }),
      });
      if(res.status === 200){
        setShowEdit(false);
      }
    };

    const handleDelete = async () => {
        await fetch(`/api/posts`, {
            method: "DELETE",
            body: JSON.stringify({ 
                id: post.id,
                slug: post.slug,
                userEmail: post.userEmail,
            })
        }).then((res)=>{
            if(!res.ok){
                console.log("something went wrong")
            }
            router.push("/");
        })
    }

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
                    <div className={styles.textWrapper}>
                        <span className={styles.text}>Content</span>
                        <button className={styles.contentBtn}>
                            Edit
                        </button>
                    </div>
                </div>
                <div className={styles.right}>
                    <span className={styles.text}>Cover photo</span>
                    {media && <ProgressBar progress={progress} />}
                    {(!file && progress !== 100) ? (
                        <div className={styles.imgWrapper}>
                            <Image className={styles.img} src={post.img} alt="" fill />
                        </div>
                        ):(
                        <div className={styles.imgWrapper}>
                            <Image className={styles.img} src={media} alt="" fill />
                        </div>  
                        )
                    }
                    <label htmlFor="img">
                        <span className={styles.subText}>Edit</span>
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
                        Save
                </button>
                <button 
                    className={styles.deleteBtn} 
                    onClick={handleDelete}>
                        Delete
                </button>
            </div>
        </div>
    </div>
  )
}

export default Edit