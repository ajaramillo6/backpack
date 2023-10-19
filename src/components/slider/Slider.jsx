"use client"

import React, { useEffect, useState } from 'react'
import styles from "./slider.module.css";
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import Image from 'next/image';

const Slider = () => {

    const [index, setIndex] = useState(0);
    const [factor, setFactor] = useState(-90.5);

  const posts = [
    {
        id: 1,
        title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        img: "/featured.jpg",
        desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. A explicabo praesentium dolorum, ea commodi molestiae fugiat cumque excepturi quidem. Sunt praesentium dolor magni voluptate dolores neque sed ad animi nostrum!"
    },
    {
        id: 2,
        title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        img: "/featured.jpg",
        desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. A explicabo praesentium dolorum, ea commodi molestiae fugiat cumque excepturi quidem. Sunt praesentium dolor magni voluptate dolores neque sed ad animi nostrum!"
    },
    {
        id: 3,
        title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        img: "/featured.jpg",
        desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. A explicabo praesentium dolorum, ea commodi molestiae fugiat cumque excepturi quidem. Sunt praesentium dolor magni voluptate dolores neque sed ad animi nostrum!"
    },
    {
        id: 4,
        title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        img: "/featured.jpg",
        desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. A explicabo praesentium dolorum, ea commodi molestiae fugiat cumque excepturi quidem. Sunt praesentium dolor magni voluptate dolores neque sed ad animi nostrum!"
    },
  ]

  const handleScroll = (direction) => {
    if(direction === "l"){
        setIndex(index !== 0 ? index - 1 : posts.length - 1);
    }
    if(direction === "r"){
        setIndex(index !== posts.length - 1 ? index + 1 : 0);
    }
}

useEffect(()=>{
    let width = window.innerWidth;
    if(width > 1280){
        setFactor(-90.5);
    } else if (width <= 1280 && width > 1024){
        setFactor(-80.5);
    } else if (width <= 1024 && width > 768) {
        setFactor(-84);
    } else if (width <= 768 && width > 650) {
        setFactor(-90);
    } else {
        setFactor(-95);
    }
},[window.innerWidth]);

  return (
    <div className={styles.sliderContainer}>
        <div 
            className={styles.sliderWrapper} 
            style={{
                transform:`translateX(${factor*index}vw)`,
                width:`${posts.length*88}vw`,
            }}>
        {posts.map((post, idx)=>(
            <div key={idx} className={styles.post}>
                <div className={styles.imgContainer}>
                    <Image className={styles.image} src={post.img} alt="" fill />
                </div>
                <div className={styles.postContainer}>
                    <h1 className={styles.postTitle}>
                    {post.title}
                    </h1>
                    <p className={styles.postDesc}>
                    {post.desc}
                    </p>
                    <button className={styles.button}>Read More</button>
                </div>
            </div>
        ))}
        </div>
        <div className={styles.scrollIcons}>
            {index > 0 &&
            <div className={styles.scrollIcon} style={{left: 0}} onClick={()=>handleScroll("l")}>
                <WestIcon style={{fontSize:"30px"}} />
            </div>
            }
            {index < (posts.length - 1) &&
            <div className={styles.rightIcon} onClick={()=>handleScroll("r")}>
                <div className={styles.scrollIcon} style={{right: 0}}>
                    <EastIcon style={{fontSize:"30px"}} />
                </div>
                {index === 0 && <span className={styles.text}>View More</span>}
            </div>
            }
        </div>
      </div>
  )
}

export default Slider