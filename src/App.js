import React, { Suspense } from "react";
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'

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

function App() {
  const getLibrary = (provider) => {
    const library = new Web3Provider(provider, 'any')
    library.pollingInterval = 15000
    return library
  }

  return (
    <div>
      <Suspense fallback={<div className="loading" />}>
        <Web3ReactProvider getLibrary={getLibrary}>
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
        </Web3ReactProvider>
      </Suspense>
    </div>
  );
}
export default App;
