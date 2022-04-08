import React from "react";
import { Admin } from "react-admin";
import { SWRConfig } from "swr";
import authProvider from "./auth";
import dataProvider from "./data";
import patternResource from "./patterns";

const App = () => (
  <React.StrictMode>
    <SWRConfig
      value={{
        shouldRetryOnError: false,
      }}
    >
      <Admin
        dataProvider={dataProvider}
        authProvider={authProvider}
        disableTelemetry
      >
        {patternResource}
      </Admin>
    </SWRConfig>
  </React.StrictMode>
);

export default App;
