import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./Loader.scss";

import { useEffect, useState } from "react";

const Loader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <div className={`home loader ${isLoading ? "loading" : ""}`}>
      <>
        <section className="loader-background">
          <Skeleton height="20rem" />
        </section>
        <h1 className="loader-title">
          <Skeleton width={250} height={40} />
          <Skeleton width={250} height={40} />
        </h1>
        <main className="loader-products">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div className="product-card" key={index}>
                <Skeleton height={200} />
                <Skeleton
                  width={`80%`}
                  height={20}
                  style={{ marginTop: "1rem" }}
                />
                <Skeleton
                  width={`60%`}
                  height={20}
                  style={{ marginTop: "0.5rem" }}
                />
              </div>
            ))}
        </main>
      </>
    </div>
  );
};

export default Loader;
