"use client"

import React, { 
  useEffect, 
  useState,
} from 'react';
import styles from './writePage.module.css';

import { countryListAllIsoData } from '@/src/countries';

//Firebase tools
import {
  getStorage, 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
} from "firebase/storage";
import { app } from "../../utils/firebase";

//Tools
import dynamic from "next/dynamic";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

//MUI Icons
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

//Components
import Spinner from '@/src/components/spinner/Spinner';
// import Editor from '@/src/components/editor/Editor';
const Editor = dynamic(() => import('@/src/components/editor/Editor'), {
  ssr: false,
});

const WritePage = () => {

  //Find session
  const { status, data } = useSession();

  const router = useRouter();

  const userEmail = data?.user?.email;

  //Use states
  const [file, setFile] = useState(null);
  const [media, setMedia] = useState("");
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [cat, setCat] = useState("");
  const [country, setCountry] = useState("");
  const [progress, setProgress] = useState(0);
  const [loadingPublish, setLoadingPublish] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [authorized, setAuthorized] = useState(true);

  useEffect(()=>{
    if((userEmail === 'megandunnavant4@gmail.com') || (userEmail === 'laurenjdunnavant@gmail.com')){
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }
  },[userEmail])

  useEffect(()=>{
    file && upload(file);
  },[file]);

  //Handle initial cover image
  const upload = (file) => {
    const storage = getStorage(app);
    const uniqueName = new Date().getTime() + file?.name;
    //Store in firebase
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

  const handleSaveDraft = async () => {
    setLoadingDraft(true);
    const res = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({
        title,
        desc: value,
        img: media,
        country,
        catSlug: (cat !== 'Select category *') && cat,
        slug: slugify(title),
        published: false,
      }),
    });
    if(res.status === 200){
      const data = await res.json();
      router.push(`/posts/${data.slug}`);
    }
  };

  const handleSubmit = async () => {
    setLoadingPublish(true);
    const res = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({
        title,
        desc: value,
        img: media,
        country,
        catSlug: (cat !== 'Select category *') && cat,
        slug: slugify(title),
        published: true,
      }),
    });
    if(res.status === 200){
      const data = await res.json();
      router.push(`/posts/${data.slug}`);
    }
  };

  //Handle loading and authentication
  if(status === "loading"){
    return (
      <div className={styles.container}>
        <Spinner />
      </div>
    )
  };
  if((status === "unauthenticated") || !authorized){
    router.push("/");
  };

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

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
        :<>
          {media && <div className={styles.imgContainer}>
            <Image 
              className={styles.image} 
              src={media} alt="" 
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>}
        </>
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
      <Editor
        value={value}
        setValue={setValue}
      />
      <button className={(
        (title && title !== "") && (cat && cat !== "Select category")
        ) ? (loadingDraft ? styles.loadingDraft:styles.draft):styles.prohibitDraft} 
        onClick={
          (((title && title !== "") 
          && (cat && cat !== "Select category")))
          ? handleSaveDraft : undefined}>
            {loadingDraft 
              ? <div className={styles.loadingText}>
                  <Spinner />
                  <span>Saving Draft...</span>
                </div>
              :"Save Draft"
            }
      </button>
      <button className={(
        (title && title !== "") && (cat && cat !== "Select category")
        ) ? (loadingPublish ? styles.loading:styles.publish):styles.prohibit} 
        onClick={
          (((title && title !== "") 
          && (cat && cat !== "Select category"))) 
          ? handleSubmit : undefined}>
            {loadingPublish
              ? <div className={styles.loadingText}>
                  <Spinner />
                  <span>Publishing...</span>
                </div>
              :"Publish"
            }
      </button>
    </div>
  )
}

export default WritePage