"use client"
import styles from './homepage.module.css'
import Featured from '../components/featured/Featured'
import CardList from '../components/cardList/CardList'
import Menu from '../components/menu/Menu';
import CountryFilter from '../components/countryFilter/CountryFilter';
import NoUser from '../components/noUser/NoUser';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Home = ({ searchParams }) => {

  const { status } = useSession();
  const router = useRouter();

  const page = parseInt(searchParams.page) || 1;
  const country = searchParams.country;
  const user = searchParams.user;

  if(user === "undefined" && status === 'authenticated'){
    router.push("/");
  }

  return (
    <div className={styles.container}>
      {(user === "undefined" && status !== 'authenticated') && <NoUser />}
      <Featured />
      <CountryFilter />
      <div className={styles.content}>
        <CardList page={page} country={country} />
        <Menu country={country} />
      </div>
    </div>
  )
}

export default Home
