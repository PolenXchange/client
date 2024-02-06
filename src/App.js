import React, { useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import WelcomeNavBar from "./components/WelcomeNavbar.js";
// eslint-disable-next-line
import styles from "./index.css";
import LandingPage from "./pages/LandingPage.js";
import ExchangePage from "./pages/ExchangePage.js";
import SwapPage from "./pages/SwapPage.js";
import { setTheme } from "./redux/theme/themeSlice.js";

function App() {
  useEffect(() => {
    setTheme("dark");
  }, []);

  return (
    <BrowserRouter>
      {/* <Router>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/exchange" component={ExchangePage} />
        </Switch>
      </Router> */}
      {/* <WelcomeNavBar /> */}
      <Routes>
        <Route path="/" element={<WelcomeNavBar />}>
          <Route index element={<LandingPage />} />
          <Route path="exchange" element={<ExchangePage />} />
          <Route path="swap" element={<SwapPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
