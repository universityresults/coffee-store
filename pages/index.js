import { useEffect, useState, useContext } from "react";

import Head from "next/head";
import Image from "next/image";

import Banner from "../components/banner";
import styles from "/styles/Home.module.css";
import Card from "./../components/card";
import { fetchCoffeeStores } from "../lib/coffee-stores";
import useTrackLocation from "./../hooks/useTrackLoaction";
import { ACTION_TYPES, StoreContext } from "../context/store.context";

export async function getStaticProps(context) {
  const coffeeStore = await fetchCoffeeStores();

  return {
    props: {
      coffeeStore,
    },
  };
}

export default function Home(props) {
  const { dispatch, state } = useContext(StoreContext);

  const { coffeeStores, latLong } = state;

  // const [coffeetSores, setCoffeeStores] = useState([]);
  const [coffeetSoresError, setCoffeeStoresError] = useState(null);

  const { handleTrackLocation, locationErrorMsg, isFindeingLocation } = useTrackLocation();

  useEffect(() => {
    async function setCoffeeStoresByLocation() {
      if (latLong) {
        try {
          const data = await fetch(`/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30`);
          const fetchedCoffeeStores = await data.json();
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {
              coffeeStores: fetchedCoffeeStores,
            },
          });
        } catch (error) {
          //set error
          setCoffeeStoresError(error.message);
        }
      }
    }
    setCoffeeStoresByLocation();
  }, [latLong]);

  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          //
          handleOnClick={handleOnBannerBtnClick}
          buttonText={!isFindeingLocation ? "View stores nearby" : "Loacting..."}
        />
        {locationErrorMsg.length > 0 && <p>Something went wrong: {locationErrorMsg}</p>}
        {coffeetSoresError && <p>Something went wrong: {coffeetSoresError}</p>}

        <div className={styles.heroImage}>
          <Image src={"/static/hero-image.png"} alt="" width="700" height="400" />
        </div>

        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((e) => {
                return (
                  <Card
                    //
                    key={e.id}
                    className={styles.card + Math.random()}
                    name={e.name}
                    url={`/coffee-store/${e.id}`}
                    img={e.imgUrl || "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"}
                  />
                );
              })}
            </div>
          </div>
        )}

        {props.coffeeStore.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Gaziantep stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStore.map((e) => {
                return (
                  <Card
                    //
                    key={e.id}
                    className={styles.card + Math.random()}
                    name={e.name}
                    url={`/coffee-store/${e.id}`}
                    img={e.imgUrl || "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
