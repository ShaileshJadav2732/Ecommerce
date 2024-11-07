import { ChangeEvent, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import countryList from "react-select-country-list";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const Shipping = () => {
  const navigate = useNavigate();

  const [countryOptions, setCountryOptions] = useState(countryList().getData());
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  });
  const changeHandler = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleCountryChange = (selectedCountry: any) => {
    setShippingInfo({ ...shippingInfo, country: selectedCountry.value });
  };

  return (
    <div className="shipping">
      <button className="back-btn" onClick={() => navigate("/cart")}>
        <BiArrowBack />
      </button>

      <form action="">
        <h1>Shipping Address</h1>
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={shippingInfo.address}
          onChange={changeHandler}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={shippingInfo.city}
          onChange={changeHandler}
        />
        <Select 
          options={countryOptions}
          value={countryOptions.find(
            (option) => option.value === shippingInfo.country
          )}
          onChange={handleCountryChange}
          placeholder="Select Country"
          className="country-dropdown"
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={shippingInfo.state}
          onChange={changeHandler}
        />
        <input
          type="text"
          name="pinCode"
          placeholder="PinCode"
          value={shippingInfo.pinCode}
          onChange={changeHandler}
        />
        <button type="submit">Proceed to Payment</button>
      </form>
    </div>
  );
};

export default Shipping;
