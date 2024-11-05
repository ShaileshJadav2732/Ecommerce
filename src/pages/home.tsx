import { Link } from "react-router-dom";
import ProductCard from "../components/product-card";

const Home = () => {

  const addToCarthandler=()=>{}
  return (
    <div className="home">
      <section></section>
      <h1>
        Latest Products
        <Link to={"/search"} className="findmore">
          More
        </Link>
      </h1>
      <main>
        <ProductCard productId="bfjdwf" name="MACKBOOK" price={10000} stock={10} handler={addToCarthandler} photo="https://m.media-amazon.com/images/I/71eXNIDUGjL._SX679_.jpg"/>

      </main>
    </div>
  );
};

export default Home;
