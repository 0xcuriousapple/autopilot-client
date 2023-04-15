import React, { useContext } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import { getAddress } from "../utils/address";
import { transfer } from "../utils/account";
import { AccountContext } from "../context/AccountContext";
import { shortenAddress } from "../utils/shortenAddress";
import { Loader } from ".";
import { ethers } from "ethers";

const companyCommonStyles =
  "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
);

export const Welcome = () => {
  const { currentAccount, isLoading, setIsLoading, deployed, balance } =
    useContext(AccountContext);

  // const handleSubmit = (e) => {
  //   const { addressTo, amount, keyword, message } = formData;

  //   e.preventDefault();

  //   if (!addressTo || !amount || !keyword || !message) return;

  //   sendTransaction();
  // };

  const createAccount = async () => {
    setIsLoading(true);
    // transfer 0 to zero address to create account
    await transfer(ethers.constants.AddressZero, "0");
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex w-full justify-center items-center">
          <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
            <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
              <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
                Automate your account <br />
              </h1>
              <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
                Non-custodially*
              </p>

              {deployed ? (
                <button
                  type="button"
                  onClick={getAddress}
                  className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
                >
                  <AiFillPlayCircle className="text-white mr-2" />
                  <p className="text-white text-base font-semibold">
                    Configure Account
                  </p>
                </button>
              ) : ethers.utils
                  .parseEther(balance)
                  .gte(ethers.utils.parseEther("0.05")) ? (
                <button
                  type="button"
                  onClick={createAccount}
                  className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
                >
                  <AiFillPlayCircle className="text-white mr-2" />
                  <p className="text-white text-base font-semibold">
                    Create Account
                  </p>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={getAddress}
                  className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
                >
                  <AiFillPlayCircle className="text-white mr-2" />
                  <p className="text-white text-base font-semibold">
                    Top-up Account
                  </p>
                </button>
              )}
            </div>

            <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
              <div className="p-3 flex justify-end items-start flex-col rounded-xl h-48 sm:w-72 w-full my-5 eth-card .white-glassmorphism ">
                <div className="flex justify-between flex-col w-full h-full">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                      <SiEthereum fontSize={21} color="#fff" />
                    </div>
                    <BsInfoCircle fontSize={17} color="#fff" />
                  </div>
                  <div>
                    <p className="text-white font-light text-sm">
                      {shortenAddress(currentAccount)}
                    </p>
                    <p className="text-white font-semibold text-lg mt-1">
                      Görli
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
