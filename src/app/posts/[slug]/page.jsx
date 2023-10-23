import React from 'react'
import styles from "./singlePage.module.css";
import Menu from '@/src/components/menu/Menu';
import Image from 'next/image';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import { numberFormat, timeSince } from '@/src/components/Format';
import Comments from '@/src/components/comments/Comments';
import { getSinglePost } from '@/src/getData';


const SinglePage = async ({ params }) => {

    const { slug } = params;

    const data = await getSinglePost(slug);

  return (
    <div className={styles.container}>
        <div className={styles.infoContainer}>
            {data?.img &&
            <div className={styles.imageContainer}>
                <Image src={data.img} alt="" fill className={styles.image} />
            </div>}
            <div className={data?.img ? styles.textContainer:styles.textFullContainer}>
                <h1 className={styles.title}>{data?.title}</h1>
                <div className={styles.infoWrapper}>
                    <div className={styles.userInfoWrapper}>
                        {data?.user?.image &&
                        <div className={styles.userImageContainer}>
                            <Image src={data.user.image} alt="" fill className={styles.avatar} />
                        </div>}
                        <div className={styles.userTextContainer}>
                            <span className={styles.username}>{data?.user?.name}</span>
                            <span className={styles.date}>{timeSince(new Date(Date.now())-new Date(data?.createdAt))}</span>
                        </div>
                    </div>
                    <div className={styles.iconsContainer}>
                        <div className={styles.icon}>
                            <FavoriteBorderIcon />
                        </div>
                        <div className={styles.likes}>{numberFormat(data?.likes)} likes</div>
                        <div className={styles.icon}>
                            <AddCircleOutlineIcon />
                        </div>
                        <div className={styles.icon}>
                            <EditIcon />
                        </div>
                    </div>
                    <div className={styles.category}>{data?.catSlug}</div>
                </div>
            </div>
        </div>
        <div className={styles.content}>
            <div className={styles.post}>
                <div 
                    className={styles.desc} 
                    dangerouslySetInnerHTML={{ __html:data?.desc }} 
                />
                <div className={styles.comments}>
                    <Comments postSlug={slug} />
                </div>
            </div>
            <Menu type="recommendations" currPost={data} />
        </div>
    </div>
  )
}

export default SinglePage