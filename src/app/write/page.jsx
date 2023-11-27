"use client"

import React, { 
  useEffect, 
  useRef, 
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
import { app } from '../utils/firebase';

//Tools
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import dynamic from "next/dynamic";

//ReactQuill
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    // eslint-disable-next-line react/display-name
    return ({ forwardedRef, ...props }) => <RQ ref={forwardedRef} {...props} />;
  },
  { ssr: false }
);
import { Quill } from 'react-quill';

import ImageResize from "quill-image-resize-module-react";

import "react-quill/dist/quill.snow.css";

//MUI Icons
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import VideoCallIcon from '@mui/icons-material/VideoCall';

//Components
import Spinner from '@/src/components/spinner/Spinner';

const storage = getStorage(app);

Quill.register('modules/imageResize', ImageResize);

const WritePage = () => {

  //Find session
  const { status } = useSession();

  const router = useRouter();

  const quillRef = useRef();

  //Use states
  const [file, setFile] = useState(null);
  const [media, setMedia] = useState("");
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [cat, setCat] = useState("");
  const [country, setCountry] = useState("");
  const [progress, setProgress] = useState(0);
  const [imgUpload, setImgUpload] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    file && upload(file);
  },[file]);

  //Handle initial cover image
  const upload = (file) => {
    const uniqueName = new Date().getTime() + file.name;
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

  //Handle image selection for content
  const contentImgHandler = async (e) => {
    e.preventDefault();
    //Create input file
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/jpeg", "image/jpg", "image/png");
    input.click();
    // eslint-disable-next-line
    input.onchange = async () => {
      const file = input.files[0];
      const uniqueName = new Date().getTime() + file.name;

      const quillObj = quillRef?.current?.getEditor();
      const range = quillObj?.getSelection();
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
              setImgUpload(progress);
              break;
          }
        }, 
        (error) => {
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            quillObj.insertEmbed(range.index, "image", downloadURL);
          });
        }
      );
    };
  }

  const handleSubmit = async () => {
    setLoading(true);
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

  //Handle loading and authentication
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

  //Quill modules
  const modules = {
    toolbar: {
      container: [
        [
          { bold:'bold' }, 
          { italic:'italic' }, 
          { underline:'underline' }, 
          { strike:'strike' }, 
        ],
        [
          { align: '' },
          { align: 'center' },
          { align: 'right' },
          { align: 'justify' },
        ],
        [
          { header: 1 }, 
          { header: 2 }, 
        ],
        [
          { list: 'ordered' }, 
          { list: 'bullet' }
        ],
        [
          {'indent': '-1'}, 
          {'indent': '+1'}
        ], 
        [
          { link:'link' }
        ],
        [
          { clean:'clean' }
        ],
      ],
    },
    clipboard: {
      matchVisual: false
    },
    imageResize: {
      parchment: Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize']
    },
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'indent',
    'image',
    'video',
    'align',
    'link',
  ];

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
        <div className={styles.addBtns}>
          <div className={styles.addBtn}>
            {(imgUpload > 0 && imgUpload < 100) ? (
              <Spinner />
            ):(
              <AddPhotoAlternateIcon style={{fontSize:"18px"}} onClick={contentImgHandler} />
            )}
          </div>
          <div className={styles.addBtn}>
            <VideoCallIcon style={{fontSize:"18px"}} />
          </div>
        </div>
        <ReactQuill 
          forwardedRef={quillRef}
          className={styles.textArea} 
          theme="snow" 
          value={value} 
          onChange={setValue} 
          modules={modules}
          formats={formats}
          placeholder="Start typing here..." 
        />
      </div>
      <button className={(
        (title && title !== "") && (cat && cat !== "Select category")
        ) ? (loading ? styles.loading:styles.publish):styles.prohibit} 
        onClick={
          ((title && title !== "") 
          && (cat && cat !== "Select category")) 
          && handleSubmit}>
            {loading 
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