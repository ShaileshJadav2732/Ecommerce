import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItem from "../components/cart-item";
import { Link } from "react-router-dom";

const cartItems = [
  {
    productId: "fnnek",
    photo: "https://m.media-amazon.com/images/I/71eXNIDUGjL._SX679_.jpg",
    name: "MACKBOOK",
    price: 10000,
    quantity: 4,
    stock: 10,
  },
];
const subtotal = 4000;
const tax = Math.round(subtotal * 0.18);
const shippingCharges = 50;
const discount = 400;
const total = subtotal + tax + shippingCharges;

const Cart = () => {
  const [cuponCode, setCuponCode] = useState<string>("");
  const [isCuponValid, setIsCuponValid] = useState<boolean>(true);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      // Simulate checking the coupon code against a list of valid codes
      const validCodes = ["SAVE10", "20OFF", "FREESHIP"];
      if (validCodes.includes(cuponCode.toUpperCase())) {
        setIsCuponValid(true);
      } else {
        setIsCuponValid(false);
      }
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [cuponCode]);

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((item, idx) => <CartItem key={idx} cartItem={item} />)
        ) : (
          <p>No items Added</p>
        )}
      </main>
      <aside>
        <p>Subtotal: ₹{subtotal}</p>
        <p>Shipping Charges: ₹{shippingCharges}</p>
        <p>Tax: ₹{tax}</p>
        <p>
          Discount: -<em className="red">₹{discount}</em>
        </p>
        <p>
          <b>Total : ₹{total - discount}</b>
        </p>
        <input
          type="text"
          value={cuponCode}
          onChange={(e) => setCuponCode(e.target.value)}
          placeholder="Enter cupon code"
        />
        {cuponCode &&
          (isCuponValid ? (
            <span className="green">
              ₹{discount} off using the <code>{cuponCode}</code>
            </span>
          ) : (
            <span className="red">
              Invalid cupon <VscError />
            </span>
          ))}
        {cartItems.length > 0 && <Link to="/shipping">Checkout</Link>}
      </aside>
    </div>
  );
};

export default Cart;
