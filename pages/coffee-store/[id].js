import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import classes from "../../styles/coffee-store.module.css";
import Image from "next/image";
import { fetchCoffeeStores } from "../../lib/coffee-stores";
import { StoreContext } from "../../context/store.context";
import { isEmpty } from "../../utils";
import { useContext, useState, useEffect } from "react";
import useSWR from "swr";

export async function getStaticProps({ params }) {
  const coffeeStore = await fetchCoffeeStores();
  const findCoffeeStoreById = coffeeStore.find((e) => e.id === params.id);

  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  };
}

export async function getStaticPaths() {
  const coffeeStore = await fetchCoffeeStores();
  const paths = coffeeStore.map((e) => {
    return {
      params: { id: `${e.id}` },
    };
  });
  return {
    paths,
    fallback: true,
  };
}

const fetcher = (url) => fetch(url).then((res) => res.json());

const CoffeeStore = ({ coffeeStore }) => {
  const router = useRouter();
  const { id } = router.query;

  const [coffeeStoresData, setCoffeeStoresData] = useState(coffeeStore);
  const [votingCount, setVotingCount] = useState(0);

  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const handleCreateCoffeeStore = async (coffeeStore) => {
    const { id, name, address, address2, street, street2, voting, imgUrl } = coffeeStore;

    try {
      const response = await fetch(`/api/createCoffeeStore`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          address: address || "",
          address2: address2 || "",
          street: street || "",
          street2: street2 || "",
          voting,
          imgUrl,
        }),
      });

      const dbCoffeeStore = await response.json();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (coffeeStore && isEmpty(coffeeStore)) {
      if (coffeeStores.length > 0) {
        const coffeeStoreFromContext = coffeeStores.find((e) => e.id === id);
        if (coffeeStoreFromContext) {
          setCoffeeStoresData(coffeeStoreFromContext);
          handleCreateCoffeeStore(coffeeStoreFromContext);
        }
      }
    } else {
      // SSG
      handleCreateCoffeeStore(coffeeStore);
    }
  }, [id, coffeeStore, coffeeStores]);

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStoresData(data[0]);

      setVotingCount(data[0].voting);
    }
  }, [data]);

  const handleUpvoteButton = async () => {
    try {
      const response = await fetch(`/api/favouriteCoffeeStoreById`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const dbCoffeeStore = await response.json();

      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        setVotingCount(votingCount + 1);
      }
    } catch (err) {
      console.log("Error upvoting the coffee store", err);
    }
  };

  if (error) {
    return <div>Something went wrong retriving coffee store</div>;
  }

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <did className={classes.layout}>
      <Head>
        <title>{coffeeStoresData.name}</title>
      </Head>
      <div className={classes.container}>
        <div className={classes.col1}>
          <div className={classes.backToHomeLink}>
            <Link href="/">
              <a>← Back home</a>
            </Link>
          </div>
          <div className={classes.nameWrapper}>
            <h1 className={classes.name}>{coffeeStoresData.name}</h1>
          </div>
          <div className={classes.storeImgWrapper}>
            <Image
              //
              src={coffeeStoresData.imgUrl || "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"}
              width={600}
              height={360}
              className={classes.storeImg}
              alt={coffeeStoresData.name}
            />
          </div>
        </div>

        <div className={classes.col2 + " glass"}>
          <div className={classes.iconWrapper}>
            <Image alt="Icon" src="/static/icons/places.svg" width="24" height="24" />
            <p className={classes.text}>{coffeeStoresData.address || coffeeStoresData.address2}</p>
          </div>

          <div className={classes.iconWrapper}>
            <Image alt="Icon" src="/static/icons/nearMe.svg" width="24" height="24" />
            <p className={classes.text}>{coffeeStoresData.street || coffeeStoresData.street2}</p>
          </div>

          <div className={classes.iconWrapper}>
            <Image alt="Icon" src="/static/icons/star.svg" width="24" height="24" />
            <p className={classes.text}>{votingCount}</p>
          </div>

          <button className={classes.upvoteButton} onClick={handleUpvoteButton}>
            Upvote
          </button>
        </div>
      </div>
    </did>
  );
};

export default CoffeeStore;
