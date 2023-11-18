import React from "react";
import styles from "./skeleton.module.css";

export const Skeleton = ({ type, counter }) => {
    const RecentsCardSkeleton = () => (
        <div className={styles.recentsCardSkeleton}>
            <div className={styles.img}></div>
            <div className={styles.info}>
                <div className={styles.user}></div>
                <div className={styles.title}></div>
                <div className={styles.desc}></div>
                <div className={styles.details}></div>
                <div className={styles.readMore}></div>
            </div>
        </div>
    );
    const FavoritesCardSkeleton = () => (
        <div className={styles.favoritesCardSkeleton}>
            <div className={styles.infoSm}>
                <div className={styles.userSm}></div>
                <div className={styles.titleSm}></div>
                <div className={styles.detailsSm}></div>
            </div>
        </div>
    );
    const PopularCardSkeleton = () => (
        <div className={styles.popularCardSkeleton}>
            <div className={styles.imgSm}></div>
            <div className={styles.infoSm}>
                <div className={styles.userSm}></div>
                <div className={styles.titleSm}></div>
                <div className={styles.detailsSm}></div>
            </div>
        </div>
    );
    if(type === 'recents') return Array(counter).fill(<RecentsCardSkeleton />);
    if(type === 'favorites') return Array(counter).fill(<FavoritesCardSkeleton />);
    if(type === 'popular') return Array(counter).fill(<PopularCardSkeleton />);
}