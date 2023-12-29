"use client";

import React from 'react';
import styles from './homepage.module.css';

//Tools
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

//Components
import Header from '../components/header/Header';
import CountryFilter from '../components/countryFilter/CountryFilter';
import CardList from '../components/cardList/CardList'
import Menu from '../components/menu/Menu';
import NoUser from '../components/noUser/NoUser';

export const dynamic='force-dynamic';

const Home = ({ searchParams }) => {

  const { status } = useSession();
  const router = useRouter();

  //Params
  const page = parseInt(searchParams.page) || 1;
  const country = searchParams.country;
  const user = searchParams.user;

  //Handle authentication access
  if(user === "undefined" && status === 'authenticated'){
    router.push("/");
  }

  return (
    <div className={styles.container}>
      {(user === "undefined" && status !== 'authenticated') && <NoUser />}
      <Header />
      <CountryFilter />
      <div className={styles.content}>
        <CardList page={page} country={country} />
        <Menu country={country} />
      </div>
    </div>
  )
}

export default Home
