import jsonServerProvider from "ra-data-json-server";
import React from "react";
import { Admin, Datagrid, List, Resource, TextField } from "react-admin";
import { PatternCreate, PatternEdit } from "./Edit";

const dataProvider = jsonServerProvider(new URL("/api", location.href).href);

const PatternList = (props) => (
  <List {...props}>
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
    <Admin dataProvider={dataProvider}>
      <Resource
        name="patterns"
        list={PatternList}
        edit={PatternEdit}
        create={PatternCreate}
      />
    </Admin>
  </React.StrictMode>
);

export default App;
