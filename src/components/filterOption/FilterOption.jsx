"use client"
import { useRouter } from 'next/navigation'
import React from 'react'
import styles from "./filterOption.module.css";

const FilterOption = ({posts, cat}) => {

  const uniqueTags = [];
  posts.map(post => {
    if (uniqueTags.indexOf(post.country) === -1) {
        uniqueTags.push(post.country)
    }
  });

  const router = useRouter();
  
  return (
    <select className={styles.countryList} onChange={(e)=>router.push(`?cat=${cat || ""}&country=${e.target.value}`)}>
        <option value={""}>Select a country</option>
        {uniqueTags.map((post)=>(
            <option value={post.country}>{post}</option>
        )).sort()}
    </select>
  )
}

export default FilterOption