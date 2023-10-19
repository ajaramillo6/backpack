import React from 'react'
import styles from "./card.module.css";
import Image from 'next/image';
import Link from 'next/link';
import { numberFormat, timeSince } from '../Format';

const Card = ({ post, type, key }) => {

  return (
    <div className={type === 'lg' ? styles.container : styles.containerSm} key={key}>
        {(type !== 'sm' && post.img) && (
        <div className={type === 'lg' ? styles.imageContainer : type !== 'recommendationImg' ? styles.imageContainerSm : styles.imageContainerRecommendation}>
            <Image 
                className={type === 'lg' 
                    ? styles.image 
                    : styles.imageSm} 
                src={post.img} 
                alt="" 
                layout='fill' 
                objectFit='cover' 
            />
        </div>)}
        <div className={type === 'lg' ? styles.textContainer : styles.textContainerSm}>
            <div>
                <span className={type === 'lg' ? styles.username : styles.usernameSm}>{post.user?.name}</span>
                <span> - </span>
                <Link href={`/blog?cat=${post.catSlug}`}>
                    <span className={type === 'lg' 
                        ? styles.categoryLg 
                        : styles.category
                        }>{post.catSlug}
                    </span>
                </Link>
            </div>
            <h1 className={type === 'lg' ? styles.title : styles.titleSm}>
                <Link className={styles.link} href={`/posts/${post.slug}`}>{post.title}</Link>
            </h1>
            {type === 'lg' &&
            <div 
                className={styles.desc} 
                dangerouslySetInnerHTML={{ __html:post?.desc }} 
            />}
            <div className={styles.details}>
                <span className={styles.date}>{timeSince(new Date(Date.now())-new Date(post.createdAt))}</span>
                <span className={styles.likes}>{numberFormat(post.likes)} likes</span>
            </div>
            {type === 'lg' && <Link className={styles.linkRead} href={`/posts/${post.slug}`}>Read More</Link>}
        </div>
    </div>
  )
}

export default Card