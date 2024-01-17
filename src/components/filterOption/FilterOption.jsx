"use client";

import React from 'react'
import styles from "./filterOption.module.css";

//Tools
import { useRouter } from 'next/navigation'

const FilterOption = ({posts, cat}) => {

  const uniqueTags = [];
  posts?.map(post => {
    if (uniqueTags.indexOf(post.country) === -1) {
        uniqueTags.push(post.country)
    }
  });

  const router = useRouter();
  
  return (
    <select className={styles.countryList} onChange={(e)=>router.push(`?cat=${cat || ""}&country=${e.target.value}`)}>
        <option value={""}>Select a state</option>
        {uniqueTags.map((post)=>(
            <option value={post.country}>{post}</option>
        ))}
    </select>
  )
}

export default FilterOption