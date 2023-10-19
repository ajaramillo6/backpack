"use client"

import React, { useEffect, useState } from 'react';
import styles from './writePage.module.css';
import ImageIcon from '@mui/icons-material/Image';
import UploadIcon from '@mui/icons-material/Upload';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from '../utils/firebase';
import { countryListAllIsoData } from '@/src/countries';
import { usaStatesListAllData } from '@/src/states';
import ProgressBar from '@/src/components/progressBar/ProgressBar';

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
  const [state, setState] = useState("");
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

  if(status === "Loading"){
    return <div className={styles.loading}>Loading...</div>
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
        state,
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
      {file && <ProgressBar progress={progress}/>}
      <input 
        type="text" 
        placeholder="Title" 
        className={styles.input} 
        onChange={e=>setTitle(e.target.value)}
      />
      <div className={styles.selectWrapper}>
        <select 
          className={styles.select} 
          onChange={(e)=>setCat(e.target.value)}>
            <option value="Select category">Select category *</option>
            <option value="tropical">tropical</option>
            <option value="beach & ocean">beach & ocean</option>
            <option value="national park">national park</option>
            <option value="city life">city life</option>
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
        {country === 'United States' &&
          <select 
            className={styles.select} 
            onChange={(e)=>setState(e.target.value)}>
            {usaStatesListAllData.map(state=>(
              <option 
                key={state.number} 
                >
                {state.name}
              </option>
            ))}
          </select>
        }
      </div>
      <div className={styles.editor}>
        <div className={styles.add}>
          <input 
            type="file" 
            id="image" 
            onChange={e=>setFile(e.target.files[0])} 
            style={{display: "none"}}
          />
          <button className={styles.addButton}>
            <label htmlFor="image" style={{cursor: "pointer"}}>
              <ImageIcon />
            </label>
          </button>
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
      <button className={styles.publish} onClick={handleSubmit}>Publish</button>
    </div>
  )
}

export default WritePage