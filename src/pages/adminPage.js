import React, { Fragment } from "react";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { ethers, BigNumber } from "ethers";

const AdminPage = () => {

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
      <div className="body-div w-auto h-auto sm:h-screen md:h-screen">
        <div className="grid grid-flow-col grid-rows-2 sm:grid-rows-none grid-cols-12 pt-2 px-2 md:px-10 h-32 sm:h-24 md:h-24 lg:h-24">
          <div className="row-span-auto col-span-12 sm:col-span-7 md:col-span-7 flex flex-auto justify-center sm:justify-around md:justify-start gap-2">
            <img className="grow w-8 sm:w-12 h-8 sm:h-12 my-auto ml-4" src="assets/image/discord.png" alt="" />
            <img className="grow w-8 sm:w-12 h-8 sm:h-12 my-auto mx-2" src="assets/image/twitter.png" alt="" />
            <img className="grow my-auto top-title w-64" src="assets/image/toptitle.png" alt="" />
          </div>
          <div className="row-span-auto col-span-12 sm:col-start-8 md:col-start-9 sm:col-span-5 md:col-span-4 my-auto flex flex-auto justify-evenly gap-1">
            <div className="top-button text-[19px] sm:text-[19px] md:text-[20px] py-[18px]">Result</div>
            <div className="top-button connect-button text-[19px] sm:text-[19px] md:text-[20px] py-[18px]">Connect Wallet</div>
          </div>
        </div>
        <div className="main-div mx-auto w-11/12 sm:w-9/12">
          <div className="jackpot-winner-div grid grid-flow-col grid-rows-2 sm:grid-rows-none grid-cols-none sm:grid-cols-2">
            <div className="time-count-div row-span-auto col-span-2 sm:col-span-1">
              <div className="solana-div h-3/4 z-10 sm:hidden">
              </div>
              <p className="jackpot-title text-[23px] sm:text-[45px] mt-12 md:mt-20 z-20 pl-6 sm:pl-10">Round 3: In progress</p>
              <div className="grid grid-flow-col grid-cols-3 mt-[40px] sm:mt-[90px] md:mt-[50px] lg:mt-[130px] mb-[20px] z-20 pl-6 sm:pl-10">
                <div className="col-span-1 time-show-button sm:mb-[60px] py-[18px] w-[90px] sm:w-32 text-[20px] sm:text-[50px]">03</div>
                <div className="col-span-1 time-show-button sm:mb-[60px] py-[18px] w-[90px] sm:w-32 text-[20px] sm:text-[50px]">16</div>
                <div className="col-span-1 time-show-button sm:mb-[60px] py-[18px] w-[90px] sm:w-32 text-[20px] sm:text-[50px]">35</div>
              </div>
            </div>
            <div className="row-span-auto col-span-2 sm:col-span-1 grid grid-flow-col grid-rows-none sm:grid-rows-2 sm:px-10 h-auto">
              <div className="row-span-1 row-start-2 grid grid-flow-col grid-rows-2 sm:grid-rows-3">
                <div className="row-span-1 sm:row-span-2 winner-ticket-div pt-3">
                  <p className="jackpot-title text-[23px] mx-10 sm:text-[45px] z-20">Winner ticket: </p>
                  <p className="jackpot-title text-[23px] mx-10 sm:text-[45px] text-right z-20">3677</p>

                </div>
                <div className="row-span-1 grid grid-flow-col grid-cols-2 flex-auto justify-items-end pb-5">
                  <div className="col-span-1 buy-button mt-[30px] sm:mt-[10px] pt-[10px] sm:pt-[5px] w-[160px] sm:w-56 text-[20px] sm:text-[25px] justify-self-start">WITHDRAW</div>
                  <div className="col-span-1 buy-button mt-[30px] sm:mt-[10px] pt-[10px] sm:pt-[5px] w-[160px] sm:w-56 text-[20px] sm:text-[25px] justify-self-end">START ROUND4</div>
                </div>
              </div>
            </div>
            <div className="solana-div h-5/6 z-10 hidden sm:block">
            </div>
          </div>
          <div className="grid grid-flow-col grid-rows-3 sm:grid-rows-none md:grid-cols-3 gap-2 sm:gap-1 md:gap-2 lg:gap-8 mt-[10px] info-total-div">
            <div className="md:col-span-1 info-div px-[30px] sm:px-[20px] py-[15px] sm:py-[20px]">
              <p className="info-title text-[28px] md:text-[36px] lg:text-[45px]">3h 16m 35s</p>
              <p className="deps-title text-[23px] md:text-[30px]">Round 3</p>
            </div>
            <div className="md:col-span-1 info-div px-[30px] sm:px-[20px] py-[15px] sm:py-[20px]">
              <p className="info-title text-[28px] md:text-[36px] lg:text-[45px]">5678/10000</p>
              <p className="deps-title text-[23px] md:text-[30px]">Tickets Sold</p>
            </div>
            <div className="md:col-span-1 info-div px-[30px] sm:px-[20px] py-[15px] sm:py-[20px]">
              <p className="info-title text-[28px] md:text-[36px] lg:text-[45px]">2500 SOL</p>
              <p className="deps-title text-[23px] md:text-[30px]">Jackpot</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminPage;
