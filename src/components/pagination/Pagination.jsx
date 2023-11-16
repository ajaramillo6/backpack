"use client";

import React from 'react'
import styles from "./pagination.module.css";

//Tools
import { useRouter } from 'next/navigation';

//MUI Icons
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

const Pagination = ({ page, havePrev, haveNext, type, user }) => {

  const router = useRouter()

  return (
    <div className={styles.container}>
      <button 
        className={styles.button}
        disabled={!havePrev}
        onClick={()=>router.push(type !== 'profile' ? `?page=${page-1}`: `?user=${user}&page=${page-1}`)}>
          <ArrowRightAltIcon style={{transform:"rotate(180deg", fontSize: "30px"}} />
          Previous
      </button>
      <button 
        className={styles.button} 
        disabled={!haveNext}
        onClick={()=>router.push(type !== 'profile' ? `?page=${page+1}` : `?user=${user}&page=${page+1}`)}>
          Next
          <ArrowRightAltIcon style={{fontSize: "30px"}} />
      </button>
    </div>
  )
}

export default Pagination