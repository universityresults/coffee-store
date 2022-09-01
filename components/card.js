import React from "react";
import Image from "next/image";
import Link from "next/link";

import styles from "./card.module.css";

const Card = (prop) => {
  return (
    <Link href={prop.url}>
      <a className={styles.cardLink}>
        <div className={`${styles.container} glass`}>
          <div className={styles.cardHeaderWrapper}>
            <h2 className={styles.cardHeader}>{prop.name}</h2>
          </div>
          <div className={styles.cardImageWrapper}>
            <Image className={styles.cardImage} src={prop.img} alt="photo" width={260} height={160} />
          </div>
        </div>
      </a>
    </Link>
  );
};

export default Card;
