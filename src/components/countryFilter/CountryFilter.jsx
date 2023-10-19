import React from 'react'
import styles from './countryFilter.module.css';
import { countryListAllIsoData } from '@/src/countries'

const CountryFilter = () => {
  return (
    <div className={styles.container}>
        <select className={styles.countryList}>
            {countryListAllIsoData.map((country)=>(
            <option className={styles.country}>{country.name}</option>
            ))}
        </select>
    </div>
  )
}

export default CountryFilter