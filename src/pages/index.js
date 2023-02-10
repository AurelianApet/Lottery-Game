import React, { Fragment } from "react";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { ethers, BigNumber } from "ethers";

const Home = () => {

    const {
        activate,
        deactivate,
        library,
        account
    } = useWeb3React();

    const injected = new InjectedConnector({
        supportedChainIds: [1, 3, 4, 5, 42, 97],
    });

    const onConnectClicked = async () => {
        try {
            await activate(injected);
        } catch (ex) {
            console.log(ex);
        }
    };

    const onDisconnectClicked = () => {
        try {
            deactivate();
        } catch (ex) {
            console.log(ex);
        }
    };

  return (
    <>
      <div className="body-div w-screen h-screen">
        <div className="grid grid-flow-col grid-cols-12 grid-row-2 pt-2 px-10 h-36">
          <div className="row-span-2 col-span-2 flex flex-auto justify-evenly">
            <img className="grow w-14 h-14 my-auto" src="assets/image/discord.png" alt="" />
            <img className="grow w-14 h-14 my-auto" src="assets/image/twitter.png" alt="" />
          </div>
          <div className="col-span-2">
            <p className="logo-title font-['Source_Code_Pro'] text-white text-[37px] text-center font-semibold">The Pickled</p>
          </div>
          <div className="row-span-1 col-span-2">
            <p className="tracking-widest logo_title text-white text-[50px] text-center font-bold
            ">Lottery</p>
          </div>
          <div className="row-span-2 col-span-1 flex flex-auto justify-start pl-3">
            <img className="grow w-18 h-24 my-auto" src="assets/image/cup.png" alt="" />
          </div>
          <div className="col-span-3"></div>
          <div className="row-span-2 col-span-4 my-auto flex flex-auto justify-evenly">
            <div className="top-button">Result</div>
            <div className="top-button">Connect Wallet</div>
          </div>
        </div>
        <div className="main-div mx-auto">
          <div className="jackpot-div">
            <p className="jackpot-title">Jackpot</p>
            <p className="sol-title">2500 SOL</p>
            <div className="buy-button">BUY TICKET</div>
          </div>
          <div className="grid grid-flow-col grid-cols-3 gap-16 info-total-div">
            <div className="col-span-1 info-div">
              <p className="info-title">3h 16m 35s</p>
              <p className="deps-title">Round 3</p>
            </div>
            <div className="col-span-1 info-div">
              <p className="info-title">5678/10000</p>
              <p className="deps-title">Tickets Sold</p>
            </div>
            <div className="col-span-1 info-div">
              <p className="info-title">2500 SOL</p>
              <p className="deps-title">Jackpot</p>
            </div>
          </div>
        </div>
        <div className="solana-div">
        </div>
      </div>
    </>
  );
}

export default Home;
