import React, { Suspense, useMemo } from "react";
import { clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
    GlowWalletAdapter,
    LedgerWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    SolletExtensionWalletAdapter,
    SolletWalletAdapter,
    TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

import {
  Route,
  withRouter,
  Switch,
  Redirect,
  BrowserRouter as Router,
} from "react-router-dom";
import BuyTicketPage from "./pages/buyTicketPage";
import WinnerPage from "./pages/winnerPage";
import AdminPage from "./pages/adminPage";
import ErrorPage from "./pages/error";
// import WalletConnectionProvider from "./walletProvider"

// import the styles
require('@solana/wallet-adapter-react-ui/styles.css');

function App() {
  const solNetwork = WalletAdapterNetwork.Mainnet;
  const endpoint = "https://tiniest-aged-yard.solana-mainnet.quiknode.pro/8f5d72ec7dd3e717884879a70107ff613b304f3f/";
  // initialise all the wallets you want to use
  const wallets = useMemo(
      () => [
          new PhantomWalletAdapter(),
          new GlowWalletAdapter(),
          new SlopeWalletAdapter(),
          new SolflareWalletAdapter({ solNetwork }),
          new TorusWalletAdapter(),
          new LedgerWalletAdapter(),
          new SolletExtensionWalletAdapter(),
          new SolletWalletAdapter(),
      ],
      [solNetwork]
  );

  return (
    <div>
      <Suspense fallback={<div className="loading" />}>
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect={true}>
                <WalletModalProvider>
                  <Router>
                    <Switch>
                      <Route path={`/`} exact render={(props) => <BuyTicketPage {...props} />} />
                      <Route path={`/winner`} exact render={(props) => <WinnerPage {...props} />} />
                      <Route path={`/admin`} exact render={(props) => <AdminPage {...props} />} />
                      <Route
                        path="/error"
                        exact
                        render={(props) => <ErrorPage {...props} />}
                      />
                      <Redirect to="/error" />
                    </Switch>
                  </Router>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
      </Suspense>
    </div>
  );
}
export default App;
