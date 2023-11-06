import styles from './homepage.module.css'
import Featured from '../components/featured/Featured'
import CategoryList from '../components/categoryList/CategoryList'
import CardList from '../components/cardList/CardList'
import Menu from '../components/menu/Menu'
import CountryFilter from '../components/countryFilter/CountryFilter'
import { getPosts } from '../getData'

const Home = async({ searchParams }) => {

  const page = parseInt(searchParams.page) || 1;
  const country = searchParams.country;

  const { posts } = await getPosts(page, country);

  return (
    <div className={styles.container}>
      <Featured />
      {posts?.length > 4 && <CategoryList />}
      <CountryFilter />
      <div className={styles.content}>
        <CardList page={page} country={country} />
        <Menu country={country} />
      </div>
    </div>
  )
}

export default Home
