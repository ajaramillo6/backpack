import React from 'react'
import styles from './comment.module.css';
import Image from 'next/image';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { timeSince } from '../Format';

const Comment = ({ key, comment }) => {
  return (
    <div className={styles.container} key={key}>
      <div className={styles.top}>
        <div className={styles.left}>
          <div className={styles.user}>
              {comment?.user?.image && 
                <Image 
                  className={styles.image} 
                  src={comment.user.image} 
                  alt="" width={50} 
                  height={50} 
                />}
              <div className={styles.userInfo}>
                  <span className={styles.username}>{comment?.user.name}</span>
                  <span className={styles.date}>{timeSince(new Date(Date.now())-new Date(comment.createdAt))}</span>
              </div>
          </div>
          <p className={styles.desc}>
              {comment?.desc}
          </p>
        </div>
        <div className={styles.right}>
          <div className={styles.icons}>
            <FavoriteBorderIcon />
            <MoreHorizIcon />
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.replies}>
          <span>2 replies</span>
          <div>
            <ArrowDropDownIcon />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Comment