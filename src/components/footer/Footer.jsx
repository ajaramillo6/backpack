import React from 'react'
import styles from "./footer.module.css";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import Link from 'next/link';

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.logo}>
          <h1 className={styles.logoText}>backpack</h1>
        </div>
        <p className={styles.desc}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. 
          Quae debitis mollitia dolorum quod eligendi est explicabo 
          necessitatibus similique perferendis, vel soluta non 
          placeat ex accusantium ullam minima eaque doloribus cu.
        </p>
        <div className={styles.icons}>
          <Link href="/" className={styles.link}>
            <FacebookIcon style={{fontSize: "25px"}} />
          </Link>
          <Link href="/" className={styles.link}>
            <InstagramIcon style={{fontSize: "25px"}} />
          </Link>
          <Link href="/" className={styles.link}>
            <TwitterIcon style={{fontSize: "25px"}} />
          </Link>
        </div>
      </div>
      <div className={styles.links}>
        <div className={styles.list}>
          <span className={styles.listTitle}>Helpful Links</span>
            <Link href="/" className={styles.link}>Contact</Link>
            <Link href="/" className={styles.link}>Settings</Link>
            <Link href="/" className={styles.link}>Terms and Conditions</Link>
            <Link href="/" className={styles.link}>Privacy Policy</Link>
        </div>
      </div>
    </div>
  )
}

export default Footer