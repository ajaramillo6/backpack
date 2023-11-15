import React from 'react';
import styles from "./confirm.module.css";

const Confirm = ({ post, setConfirm, message, subText }) => {

    const handleDelete = async () => {
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
            mutate();
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