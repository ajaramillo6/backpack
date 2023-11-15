"use client"

import React from 'react'
import styles from './countryFilter.module.css';
import { fetcher } from '@/src/getData';
import useSWR from 'swr';
import FilterOption from '../filterOption/FilterOption';

const CountryFilter = ({cat}) => {

  const getData = () => {
    const { data, isLoading } = useSWR(
      `http://localhost:3000/api/popular?cat=${cat || ""}`,
      fetcher
    );
    return { data, isLoading }
  }

  const posts = getData();

  return (
    <div className={styles.container}>
      <FilterOption posts={posts?.data} cat={cat} />
    </div>
  )
}

export default CountryFilter