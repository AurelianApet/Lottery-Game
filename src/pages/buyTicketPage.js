import React, { useEffect, useState  } from "react";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getCurrentRound, buyTicket } from "../utils/lottery";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { ThreeDots } from 'react-loader-spinner'
import  { Redirect, useHistory } from 'react-router-dom'

let init = true;
const BuyTicketPage = () => {
  const connection = useConnection();
  const wallet = useWallet();
  let history = useHistory();
  
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
  const [txLoading, setTxLoading] = useState(false);

  if(wallet.publicKey !== null && init){
    getCurrentRound(connection.connection, wallet).then((currentRound) => {
      if(currentRound.winnerAddress === wallet.publicKey) 
      {
        history.push("/winner")
      }
      setRoundData(currentRound)
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

  const handleBuyTicket = async () => {
    if(wallet.publicKey === null) {
      NotificationManager.warning("", "Please connect Wallet!", 5000)
      return;
    }

    if(roundData.timeRemained === 0 && timeSecond === 0 && roundData.roundName !== "0") {
      NotificationManager.warning("", `Round ${roundData.roundName} Finished`, 5000)
    }
    console.log("wallet", wallet, connection.connection)
    setTxLoading(true);
    let response = await buyTicket(connection.connection, wallet, roundData.roundName);
    if(response) {
      NotificationManager.success("", "Buy Ticket Success", 5000)
    } else {
      NotificationManager.warning("Please check your Wallet", "Buy Ticket failed", 5000)
    }
    setTxLoading(false);
  }

  return (
    <>
      <div className="body-div w-auto h-auto sm:h-screen md:h-screen">
        <div className="grid grid-flow-col grid-rows-2 sm:grid-rows-none grid-cols-12 pt-2 px-2 md:px-10 h-32 sm:h-24 md:h-24 lg:h-24">
          <div className="row-span-auto col-span-12 sm:col-span-7 md:col-span-7 flex flex-auto justify-center sm:justify-around md:justify-start gap-2">
            <img className="grow w-8 sm:w-12 h-8 sm:h-12 my-auto ml-4" src="assets/image/discord.png" alt="" onClick={() => { window.open("https://discord.com/invite/nveRe9y7A8", "_blank") }}/>
            <img className="grow w-8 sm:w-12 h-8 sm:h-12 my-auto mx-2" src="assets/image/twitter.png" alt="" onClick={() => { window.open("https://twitter.com/platypuspickled", "_blank") }}/>
            <img className="grow my-auto top-title w-64" src="assets/image/toptitle.png" alt="" />
          </div>
          <div className="row-span-auto col-span-12 sm:col-start-8 md:col-start-9 sm:col-span-5 md:col-span-4 my-auto flex flex-auto justify-evenly gap-1">
            <WalletMultiButton />
          </div>
        </div>
        <div className="main-div mx-auto w-11/12 sm:w-9/12">
          <div className="jackpot-div grid grid-flow-col grid-cols-2">
            <div className="col-span-1 pl-6 sm:pl-10 z-20">
              <p className="jackpot-title text-[30px] sm:text-[45px] mt-12 md:mt-16">Jackpot</p>
              <p className="sol-title text-[30px] sm:text-[50px] md:text-[60px]">{roundData.tvl} SOL</p>
              <div className="buy-button mt-[70px] sm:mt-[120px] md:mt-[80px] lg:mt-[160px] mb-[20px] sm:mb-[30px] py-[5px] w-[110px] sm:w-40 text-[15px] sm:text-[20px]"
              onClick={() => { !txLoading && handleBuyTicket() }}
              // disable this button when roundData.finished == true || roundData.timeRemained == 0 || roundData.ticketSold == roundData.totalTicket
              >
                {
                  txLoading ? <ThreeDots 
                  height="30" 
                  width="80" 
                  radius="9"
                  color="#4fa94d" 
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{"justifyContent": "center"}}
                  wrapperClassName=""
                  visible={true}
                  /> : "BUY TICKET"
                }
              </div>
            </div>
            <img className="col-span-1 justify-self-end hologram m-auto sm:my-[40px] h-[200px] w-[220px] sm:h-[300px] sm:w-96 lg:h-[400px] lg:w-[500px] sm:mb-[30px] z-20" alt=""></img>
            <div className="solana-div h-5/6 z-10">
            </div>
          </div>
          <div className="grid grid-flow-col grid-rows-3 sm:grid-rows-none md:grid-cols-3 gap-2 sm:gap-1 md:gap-2 lg:gap-8 mt-[10px] info-total-div">
            <div className="md:col-span-1 info-div px-[30px] sm:px-[20px] py-[15px] sm:py-[20px]">
              <p className="info-title text-[28px] md:text-[36px] lg:text-[45px]">{(roundData.timeRemained === 0 && timeSecond === 0) ? "Finished" : `${parseInt(timeSecond / 3600)}h ${parseInt(timeSecond % 3600 / 60)}m ${parseInt(timeSecond % 60)}s`}</p>
              <p className="deps-title text-[23px] md:text-[30px]">Round {roundData.roundName}</p>
            </div>
            <div className="md:col-span-1 info-div px-[30px] sm:px-[20px] py-[15px] sm:py-[20px]">
              <p className="info-title text-[28px] md:text-[36px] lg:text-[45px]">{roundData.ticketSold}/{roundData.totalTicket}</p>
              <p className="deps-title text-[23px] md:text-[30px]">Tickets Sold</p>
            </div>
            <div className="md:col-span-1 info-div px-[30px] sm:px-[20px] py-[15px] sm:py-[20px]">
              <p className="info-title text-[28px] md:text-[36px] lg:text-[45px]">{roundData.tvl} SOL</p>
              <p className="deps-title text-[23px] md:text-[30px]">Jackpot</p>
            </div>
          </div>
        </div>
      </div>
      <NotificationContainer/>
    </>
  );
}

export default BuyTicketPage;
