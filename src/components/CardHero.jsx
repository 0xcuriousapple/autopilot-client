import React, { useContext, useState } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import { getAddress } from "../utils/address";
import { transfer } from "../utils/account";
import { AccountContext } from "../context/AccountContext";
import { shortenAddress } from "../utils/shortenAddress";
import { Loader } from ".";
import { Popup } from ".";
import { ethers } from "ethers";
import { FiCopy } from "react-icons/fi";
import { Link } from "react-router-dom";

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

export const CardHero = () => {
  const {
    currentAccount,
    isLoading,
    setIsLoading,
    deployed,
    balance,
    showPopup,
    setShowPopup,
  } = useContext(AccountContext);

  const [addressCopied, setAddressCopied] = useState(false);

  // const handleSubmit = (e) => {
  //   const { addressTo, amount, keyword, message } = formData;

  //   e.preventDefault();

  //   if (!addressTo || !amount || !keyword || !message) return;

  //   sendTransaction();
  // };
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(currentAccount);
    setAddressCopied(true);
    setTimeout(() => setAddressCopied(false), 2000);
  };
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
          <Popup show={showPopup} onClose={() => setShowPopup(false)}>
            <h2 className="text-2xl font-bold mb-4">Insufficent Funds</h2>
            <p className="inline-flex">
              You need to transfer funds to pay for the gas fee to create a new
              account. <br />
              Please transfer{" "}
              {ethers.utils
                .formatEther(
                  ethers.utils
                    .parseEther("0.3")
                    .sub(ethers.utils.parseEther(balance))
                )
                .toString()}{" "}
              ether to the address below.
            </p>

            <div className="relative">
              <input
                className="border border-gray-300 rounded p-2 w-full my-4 text-black text-sm"
                type="text"
                value={currentAccount}
                readOnly
              />
              <button
                className="absolute top-0 right-0 h-full p-2 pl-4 text-gray-500 hover:text-gray-700"
                onClick={handleCopyAddress}
              >
                <FiCopy size={18} />
              </button>
            </div>
            <p className="mb-4">
              {addressCopied ? "Address copied to clipboard!" : ""}
            </p>
          </Popup>
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
                  <Link to="/board">
                    <p className="text-white text-base font-semibold">
                      Configure Account
                    </p>
                  </Link>
                </button>
              ) : ethers.utils
                  .parseEther(balance)
                  .gte(ethers.utils.parseEther("0.3")) ? (
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
                  onClick={() => setShowPopup(true)}
                  className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
                >
                  <AiFillPlayCircle className="text-white mr-2" />
                  <p className="text-white text-base font-semibold">
                    Create Account
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
