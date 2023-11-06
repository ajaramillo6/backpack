"use client"

import React, { useEffect, useState } from 'react';
import styles from './writePage.module.css';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import UploadIcon from '@mui/icons-material/Upload';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from '../utils/firebase';
import { countryListAllIsoData } from '@/src/countries';
import Image from 'next/image';
import Spinner from '@/src/components/spinner/Spinner';

const storage = getStorage(app);

const WritePage = () => {

  const { status } = useSession();

  const router = useRouter();

  const [file, setFile] = useState(null);
  const [media, setMedia] = useState("");
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [cat, setCat] = useState("");
  const [country, setCountry] = useState("");
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

  if(status === "loading"){
    return (
      <div className={styles.container}>
        <Spinner />
      </div>
    )
  };
  if(status === "unauthenticated"){
    router.push("/");
  };

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleSubmit = async () => {
    const res = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({
        title,
        desc: value,
        img: media,
        country,
        catSlug: (cat !== 'Select category *') && cat,
        slug: slugify(title),
      }),
    });
    if(res.status === 200){
      const data = await res.json();
      router.push(`/posts/${data.slug}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topWrapper}>
        <input 
          type="file"
          accept=".jpeg, .jpg, .png"
          style={{display: "none"}}
          id="image"
          name="image"
          onChange={(e)=>setFile(e.target.files[0])}
        />
        {(progress < 100) ?
        <div className={styles.addButtonImg}>
          {!file &&
          <label htmlFor="image" style={{cursor: "pointer"}}>
            <AddPhotoAlternateIcon style={{fontSize: "40px"}} />
          </label>}
          {file && <div className={styles.progress}><Spinner /></div>}
        </div>
        :<div className={styles.imgContainer}>
          <Image className={styles.image} src={media} alt="" fill />
        </div>
        }
        <div className={styles.rightWrapper}>
          <input 
            type="text" 
            placeholder="Title" 
            className={styles.input} 
            onChange={e=>setTitle(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.selectWrapper}>
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
        <select 
          className={styles.select} 
          onChange={(e)=>setCountry(e.target.value)}>
          {countryListAllIsoData.map(country=>(
            <option 
              key={country.number} 
              >
              {country.name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.editor}>
        <div className={styles.add}>
          <button className={styles.addButton}>
            <UploadIcon />
          </button>
          <button className={styles.addButton}>
            <VideoCallIcon />
          </button>
        </div>
        <ReactQuill 
          className={styles.textArea} 
          theme="bubble" 
          value={value} 
          onChange={setValue} 
          placeholder="Tell your story..." 
        />
      </div>
      <button className={(
        (title && title !== "") && (cat && cat !== "Select category")
        ) ? styles.publish:styles.prohibit} 
        onClick={
          ((title && title !== "") 
          && (cat && cat !== "Select category")) 
          && handleSubmit}>
            Publish
      </button>
    </div>
  )
}

export default WritePage