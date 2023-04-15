import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  getAddress,
  isContractAddress,
  getAccountBalance,
} from "../utils/address";

export const MainContext = React.createContext();

const { ethereum } = window;

export const MainContextProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [deployed, setDeployed] = useState(false);
  const [balance, setBalance] = useState("0");
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedAddress = await getAddress();
      setCurrentAccount(fetchedAddress);
      console.log({ fetchedAddress });
      const isDeployed = await isContractAddress(fetchedAddress);
      setDeployed(isDeployed);
      const balance = await getAccountBalance(fetchedAddress);
      setBalance(balance.toString());
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <MainContext.Provider
      value={{
        currentAccount,
        setIsLoading,
        isLoading,
        deployed,
        balance,
        showPopup,
        setShowPopup,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};
