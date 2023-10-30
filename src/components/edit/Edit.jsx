"use client"
import React, { useState } from 'react'
import styles from "./edit.module.css";
import { useRouter } from 'next/navigation';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';

const Edit = ({ post, setShowEdit }) => {

    const router = useRouter();

    const [title, setTitle] = useState("");
    const [cat, setCat] = useState(null);
    const [img, setImg] = useState(null);

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
        <div className={styles.wrapper}>
            <div className={styles.closeBtn} onClick={()=>setShowEdit(false)}>
                    <CloseIcon style={{fontSize:"16px"}} />
            </div>
            <div className={styles.left}>
                <h1>Edit Post</h1>
                <div className={styles.textWrapper}>
                    <span className={styles.text}>Title</span>
                    <input 
                        className={styles.input} 
                        placeholder={post.title} 
                        type="text" 
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
                    <span className={styles.text}>Content</span>
                    <button className={styles.contentBtn}>
                        Edit
                    </button>
                </div>
            </div>
            <div className={styles.right}>
                <span className={styles.text}>Cover photo</span>
                <div className={styles.imgWrapper}>
                    <Image className={styles.img} src={post.img} alt="" fill />
                </div>
                <span className={styles.subText}>Edit</span>
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