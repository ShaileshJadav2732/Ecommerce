import { useState } from "react";
import {
  FaSearch,
  FaShoppingCart,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { Link } from "react-router-dom";
import {User} from "../types/types"

 interface PropsType{ 
  user :User |null;
}

const Header = ({user}:PropsType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);


const logoutHandler =()=>{
      setIsOpen(false);
      
}

  return (
    <nav className="header">
      <Link to={"/"} onClick={() => setIsOpen(false)}>
        <IoHome />
      </Link>
      <Link to={"/cart"} onClick={() => setIsOpen(false)}>
        <FaShoppingCart />
      </Link>
      <Link to={"/search"} onClick={() => setIsOpen(false)}>
        <FaSearch />
      </Link>

      {user?._id ? (
        <>
          <button onClick={() => setIsOpen((prev) => !prev)}>
            <FaUser />
          </button>
          <dialog open={isOpen}>
            <div>
              {user?.role === "admin" && (
                <Link to="/admin/dashboard" onClick={() => setIsOpen(false)}>
                  Admin
                </Link>
              )}
              <Link to="/orders" onClick={() => setIsOpen(false)}>
                Order
              </Link>

              <button onClick={logoutHandler}>
                <FaSignOutAlt />
              </button>
            </div>
          </dialog>
        </>
      ) : (
        <Link to="/login">
          <FaSignInAlt />
        </Link>
      )}
    </nav>
  );
};

export default Header;
