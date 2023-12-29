import React from 'react'
import styles from "./searchCard.module.css";
import { numberFormat, timeSince } from '../Format';

//Tools
import Link from 'next/link';
import Image from 'next/image';

const SearchCard = ({ post, setQ }) => {
  return (
    <div className={styles.container}>
        {post.img &&
        <div className={styles.imageContainerSm}>
            <Image className={styles.imageSm} 
                src={post.img} 
                alt="" 
                layout='fill' 
                objectFit='cover' 
            />
        </div>}
        <div className={styles.textContainerSm}>
            <div onClick={()=>setQ("")}>
                <Link className={styles.link} href={`/profile?user=${post?.user?.name}`} passHref>
                    <span className={styles.usernameSm}>{post.user?.name}</span>
                </Link>
                <span> - </span>
                <Link href={`/blog?cat=${post.catSlug}`}>
                    <span className={styles.category}>{post.catSlug}</span>
                </Link>
            </div>
            <h1 className={styles.titleSm} onClick={()=>setQ("")}>
                <Link className={styles.link} href={`/posts/${post.slug}`}>{post.title}</Link>
            </h1>
            <div className={styles.details}>
                <span className={styles.date}>{timeSince(new Date(Date.now())-new Date(post.createdAt))}</span>
                <span className={styles.likes}>{`${numberFormat(post.likes.length)} ${(post.likes.length > 1 || post.likes.length === 0) ? 'likes':'like'}`}</span>
            </div>
        </div>
    </div>
  )
}

export default SearchCard