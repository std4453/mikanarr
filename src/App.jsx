import jsonServerProvider from "ra-data-json-server";
import React from "react";
import {
  Admin,
  Datagrid,
  List,
  Resource,
  TextField,
  TextInput,
} from "react-admin";
import { SWRConfig } from "swr";
import { PatternCreate, PatternEdit } from "./Edit";

const dataProvider = jsonServerProvider(new URL("/api", location.href).href);

const patternFilters = [<TextInput label="Search" source="q" alwaysOn />];

const PatternList = (props) => (
  <List
    sort={{
      field: "id",
      order: "DESC",
    }}
    filters={patternFilters}
    {...props}
  >
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="pattern" />
      <TextField source="series" />
      <TextField source="season" />
      <TextField source="language" />
      <TextField source="quality" />
    </Datagrid>
  </List>
);

const App = () => (
  <React.StrictMode>
    <SWRConfig
      value={{
        shouldRetryOnError: false,
      }}
    >
      <Admin dataProvider={dataProvider} disableTelemetry>
        <Resource
          name="patterns"
          list={PatternList}
          edit={PatternEdit}
          create={PatternCreate}
        />
      </Admin>
    </SWRConfig>
  </React.StrictMode>
);

export default App;
