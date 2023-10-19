"use client"

import React, { useState } from 'react'
import styles from './comments.module.css';
import Link from 'next/link';
import Comment from '../comment/Comment';
import useSWR from 'swr'
import { useSession } from 'next-auth/react';
import { fetcher } from '@/src/getData';
import { numberFormat } from '../Format';

const Comments = ({ postSlug }) => {

    const { status } = useSession();
    const [desc, setDesc] = useState("");

    const {data, mutate, isLoading} = useSWR(
        `http://localhost:3000/api/comments?postSlug=${postSlug}`, 
        fetcher
    );
    
    const handleSubmit = async () => {
        await fetch("/api/comments", {
            method: "POST",
            body: JSON.stringify({ 
                desc, 
                postSlug,
                slug: new Date().getTime().toString(),
            }),
        });
        mutate();
        setDesc("");
    }

  return (
    <div className={styles.container}>
        {data?.length > 0 && 
        <h1 className={styles.title}>{numberFormat(data?.length)} Comments</h1>}
        {status === 'authenticated' ? (
            <div className={styles.write}>
                <textarea 
                    placeholder='Write a comment...' 
                    className={styles.input} 
                    value={desc}
                    onChange={e=>setDesc(e.target.value)} 
                />
                <button className={styles.button} onClick={handleSubmit}>Send</button>
            </div>
        )
        :(
            <Link href="/login" className={styles.notAuthText}>Login to write a comment</Link>
        )}
        <div className={styles.comments}>
            {isLoading 
                ? "Loading"
                :data?.map((comment)=>(
                <Comment comment={comment} key={comment._id} />
            ))}
        </div>
    </div>
  )
}

export default Comments