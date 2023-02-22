import React, { useEffect, useState } from "react";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getCurrentRound, startRound, withdraw } from "../utils/lottery";

let init = true
const AdminPage = () => {
  const connection = useConnection();
  const wallet = useWallet();

  const [roundData, setRoundData] = useState({
    roundName: "0",
    totalTicket : 0,
    ticketSold : 0,
    timeRemained : 0,
    winningTicket : 0,
    tvl: 0,
    finished: true,
    claimed: true
  })
  const [timeSecond, setTimeSecond] = useState(0);

  if(wallet.publicKey != undefined && init){
    getCurrentRound(connection.connection, wallet).then((res) => {
      setRoundData(res)
    })
    init = false
  }

  useEffect(() => {
    if(parseInt(roundData.timeRemained) > 0)
      setTimeSecond(parseInt(roundData.timeRemained))
  }, [roundData])

  useEffect(() => {
    if(timeSecond > 0) {
    const intervalId = setInterval(() => {
        setTimeSecond((t) => t - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [timeSecond])

  const handleStartNewRound = async () => {
    await startRound(connection.connection, wallet, (Number(roundData.roundName)+1).toString(), 10000, 12 * 3600)
  }

  const handleWithdraw = async () => {
    await withdraw(connection.connection, wallet, roundData.tvl, roundData.roundName)
  }

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
            <WalletMultiButton />
          </div>
        </div>
        <div className="main-div mx-auto w-11/12 sm:w-9/12">
          <div className="jackpot-winner-div grid grid-flow-col grid-rows-2 sm:grid-rows-none grid-cols-none sm:grid-cols-2">
            <div className="time-count-div row-span-auto col-span-2 sm:col-span-1">
              <div className="solana-div h-3/4 z-10 sm:hidden">
              </div>
              <p className="jackpot-title text-[23px] sm:text-[45px] mt-12 md:mt-24 z-20 pl-6 sm:pl-10">
                Round {roundData.roundName === "0" ? "1": roundData.roundName}: {roundData.roundName == "0" ? "Not started": (roundData.finished ? "Finished" : "In progress")} </p>
              <div className="grid grid-flow-col grid-cols-3 mt-[40px] sm:mt-[90px] md:mt-[50px] lg:mt-[130px] mb-[6px] z-20 justify-items-center">
                <div className="col-span-1 time-show-button sm:mb-[60px] py-[18px] w-[90px] sm:w-32 text-[20px] sm:text-[50px]">{parseInt(timeSecond / 3600)}h</div>
                <div className="col-span-1 time-show-button sm:mb-[60px] py-[18px] w-[90px] sm:w-32 text-[20px] sm:text-[50px]">{parseInt(timeSecond % 3600 / 60)}m</div>
                <div className="col-span-1 time-show-button sm:mb-[60px] py-[18px] w-[90px] sm:w-32 text-[20px] sm:text-[50px]">{parseInt(timeSecond % 60)}s</div>
              </div>
            </div>
            <div className="row-span-auto col-span-2 sm:col-span-1 grid grid-flow-col grid-rows-none sm:grid-rows-2 sm:px-10 h-auto">
              <div className="row-span-1 row-start-2 grid grid-flow-col grid-rows-2 sm:grid-rows-3">
                <div className="row-span-1 sm:row-span-2 winner-ticket-div pt-3">
                  <p className="jackpot-title text-[23px] mx-10 sm:text-[45px] z-20">Winning ticket: </p>
                  <p className="jackpot-title text-[23px] mx-10 sm:text-[45px] text-right z-20">{roundData.winningTicket}</p>

                </div>
                <div className="row-span-1 grid grid-flow-col grid-cols-2 flex-auto justify-items-end pb-5">
                  <div className="col-span-1 buy-button mt-[30px] sm:mt-[10px] pt-[10px] sm:pt-[5px] w-[160px] sm:w-56 text-[20px] sm:text-[25px] justify-self-start"
                  disabled={roundData.tvl ===0}
                  onClick={() => {handleWithdraw()}}
                  >WITHDRAW</div>
                  <div className="col-span-1 buy-button mt-[30px] sm:mt-[10px] pt-[10px] sm:pt-[5px] w-[160px] sm:w-56 text-[20px] sm:text-[25px] justify-self-end"
                  disabled={!roundData.finished}
                  onClick={() => {handleStartNewRound()}}
                  > START ROUND {Number(roundData.roundName)+1}</div>
                </div>
              </div>
            </div>
            <div className="solana-div h-5/6 z-10 hidden sm:block">
            </div>
          </div>
          <div className="grid grid-flow-col grid-rows-3 sm:grid-rows-none md:grid-cols-3 gap-2 sm:gap-1 md:gap-2 lg:gap-8 mt-[10px] info-total-div">
            <div className="md:col-span-1 info-div px-[30px] sm:px-[20px] py-[15px] sm:py-[20px]">
              <p className="info-title text-[28px] md:text-[36px] lg:text-[45px]">{parseInt(timeSecond / 3600)}h {parseInt(timeSecond % 3600 / 60)}m {parseInt(timeSecond % 60)}s</p>
              <p className="deps-title text-[23px] md:text-[30px]">Round {roundData.roundName}</p>
            </div>
            <div className="md:col-span-1 info-div px-[30px] sm:px-[20px] py-[15px] sm:py-[20px]">
              <p className="info-title text-[28px] md:text-[36px] lg:text-[45px]">{roundData.ticketSold}/{roundData.totalTicket}</p>
              <p className="deps-title text-[23px] md:text-[30px]">Tickets Sold</p>
            </div>
            <div className="md:col-span-1 info-div px-[30px] sm:px-[20px] py-[15px] sm:py-[20px]">
              <p className="info-title text-[28px] md:text-[36px] lg:text-[45px]">{roundData.tvl/1e9} SOL</p>
              <p className="deps-title text-[23px] md:text-[30px]">Jackpot</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminPage;
