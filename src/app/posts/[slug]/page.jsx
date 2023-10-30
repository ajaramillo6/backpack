import React from 'react'
import styles from "./singlePage.module.css";
import { getPopular, getSinglePost } from '@/src/getData';
import SinglePageContent from '@/src/components/singlePageContent/singlePageContent';


const SinglePage = async ({ params }) => {

    const { slug } = params;

    const data = await getSinglePost(slug);

    const recommended  = await getPopular(data?.catSlug);

  return (
    <div className={styles.container}>
        <SinglePageContent data={data} recommended={recommended} />
    </div>
  )
}

export default SinglePage