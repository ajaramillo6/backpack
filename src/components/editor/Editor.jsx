"use client"

import React, { useEffect, useRef, useState } from 'react';
import styles from "./editor.module.css";

//Tools
import dynamic from "next/dynamic";

//Firebase tools
import {
    getStorage, 
    ref, 
    uploadBytesResumable, 
    getDownloadURL, 
} from "firebase/storage";
import { app } from "../../utils/firebase";

import { Quill } from 'react-quill';

//ReactQuill
const ReactQuill = dynamic(
    async () => {
        const { default: RQ } = await import('react-quill');
        return ({ forwardedRef, ...props }) => <RQ ref={forwardedRef} {...props} />;
    },
    { ssr: false }
);

import ImageResize from "quill-image-resize-module-react";

import "react-quill/dist/quill.snow.css";

Quill.register('modules/imageResize', ImageResize);

//MUI Icons
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

//Components
import Spinner from '@/src/components/spinner/Spinner';

const Editor = ({ value, setValue }) => {

    const quillRef = useRef(false);

    const [imgUpload, setImgUpload] = useState(0);

    //Use Effect
    useEffect(() => {
        
    }, [])

    //Handle image selection for content
    const contentImgHandler = async (e) => {
        e.preventDefault();
        const storage = getStorage(app);
        //Create input file
        const input = typeof document !== 'undefined' && document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/jpeg", "image/jpg", "image/png");
        input.click();
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
                console.log(error)
            }, 
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    quillObj.insertEmbed(range.index, "image", downloadURL);
                });
            }
            );
        };
    }

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
            modules: ['Resize', 'DisplaySize', 'Toolbar']
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
        'align',
        'link',
    ];

  return (
    <div className={styles.container}>
        <div className={styles.addBtns}>
          <div className={styles.addBtn}>
            {(imgUpload > 0 && imgUpload < 100) ? (
              <Spinner />
            ):(
              <AddPhotoAlternateIcon style={{fontSize:"18px"}} onClick={contentImgHandler} />
            )}
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
  )
}

export default Editor