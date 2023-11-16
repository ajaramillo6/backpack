"use client"
import React from 'react'
import styles from "./card.module.css";
import { numberFormat, timeSince } from '../Format';

//Tools
import Image from 'next/image';
import Link from 'next/link';

const Card = ({ post, type, imgSize }) => {

  return (
    <div className={imgSize === 'lg' ? styles.container : styles.containerSm}>
        {(imgSize !== 'sm' && post.img) && (
        <div className={imgSize === 'lg' ? styles.imageContainer : type !== 'recommendations' ? styles.imageContainerSm : styles.imageContainerRecommendation}>
            <Image 
                className={imgSize === 'lg' 
                    ? styles.image 
                    : styles.imageSm} 
                src={post.img} 
                alt="" 
                layout='fill' 
                objectFit='cover' 
            />
        </div>)}
        <div className={imgSize === 'lg' ? styles.textContainer : styles.textContainerSm}>
            <div>
                <Link className={styles.link} href={`/profile?user=${post?.user?.name}`} passHref>
                    <span className={imgSize === 'lg' ? styles.username : styles.usernameSm}>{post.user?.name}</span>
                </Link>
                {((type !== 'recommendations') && (type !== 'blog')) && <>
                <span> - </span>
                <Link href={`/blog?cat=${post.catSlug}`}>
                    <span className={imgSize === 'lg' 
                        ? styles.categoryLg 
                        : styles.category
                        }>{post.catSlug}
                    </span>
                </Link>
                </>}
            </div>
            <h1 className={imgSize === 'lg' ? styles.title : styles.titleSm}>
                <Link className={styles.link} href={`/posts/${post.slug}`}>{post.title}</Link>
            </h1>
            {imgSize === 'lg' &&
            <div 
                className={styles.desc} 
                dangerouslySetInnerHTML={{ __html:post?.desc }} 
            />}
            <div className={styles.details}>
                <span className={styles.date}>{timeSince(new Date(Date.now())-new Date(post.createdAt))}</span>
                <span className={styles.likes}>{`${numberFormat(post.likes.length)} ${(post.likes.length > 1 || post.likes.length === 0) ? 'likes':'like'}`}</span>
            </div>
            {imgSize === 'lg' && <Link className={styles.linkRead} href={`/posts/${post.slug}`}>Read More</Link>}
        </div>
    </div>
  )
}

export default Card