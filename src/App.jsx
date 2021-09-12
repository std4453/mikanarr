import jsonServerProvider from "ra-data-json-server";
import React from "react";
import { Admin } from "react-admin";
import { SWRConfig } from "swr";
import patternResource from "./patterns";

const dataProvider = jsonServerProvider(new URL("/api", location.href).href);

const App = () => (
  <React.StrictMode>
    <SWRConfig
      value={{
        shouldRetryOnError: false,
      }}
    >
      <Admin dataProvider={dataProvider} disableTelemetry>
        {patternResource}
      </Admin>
    </SWRConfig>
  </React.StrictMode>
);

export default App;
