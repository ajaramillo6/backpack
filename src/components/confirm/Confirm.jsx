"use client"
import React from 'react';
import styles from "./confirm.module.css";

//Firebase tools
import { getStorage, ref, deleteObject } from "firebase/storage";

//Tools
import { useRouter } from 'next/navigation';

const Confirm = ({ post, setConfirm, message, subText }) => {

    const router = useRouter();

    //Handle function
    const handleDelete = async () => {
        //Find firebase data
        const storage = getStorage();
        const coverImg = post?.img?.split("/o/")[1]?.split("?")[0];
        const coverImgRef = ref(storage, coverImg?.replaceAll("%20", " "));
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
        //Delete from database
        await fetch(`/api/posts`, {
            method: "DELETE",
            body: JSON.stringify({ 
                id: post.id,
                slug: post.slug,
                userName: post.userName,
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
            <div className={styles.texts}>
                <span className={styles.message}>{message}</span>
                <span className={styles.subText}>{subText}</span>
            </div>
            <div className={styles.btns}>
                <button className={styles.cancelBtn} onClick={()=>setConfirm(false)}>Cancel</button>
                <button className={styles.confirmBtn} onClick={handleDelete}>Confirm</button>
            </div>
        </div>
    </div>
  )
}

export default Confirm