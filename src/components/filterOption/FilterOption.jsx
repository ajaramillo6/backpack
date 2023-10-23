"use client"
import { useRouter } from 'next/navigation'
import React from 'react'
import styles from "./filterOption.module.css";

const FilterOption = ({posts, cat}) => {
    const router = useRouter();
  return (
    <select className={styles.countryList} onChange={(e)=>router.push(`?cat=${cat || ""}&country=${e.target.value}`)}>
        <option value={""}>Select a country</option>
        {posts.map((post)=>(
            <option value={post.country}>{post.country}</option>
        )).sort()}
    </select>
  )
}

export default FilterOption