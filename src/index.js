import React from "react";
import ReactDOM from "react-dom";
import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  List,
  Datagrid,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
  Create,
} from "react-admin";
import jsonServerProvider from "ra-data-json-server";

const dataProvider = jsonServerProvider("http://localhost:12306");

const PatternList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="pattern" />
      <TextField source="series" />
      <TextField source="season" />
    </Datagrid>
  </List>
);

const PatternEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="pattern" />
      <TextInput source="series" />
      <TextInput source="season" />
    </SimpleForm>
  </Edit>
);

const PatternCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="pattern" />
      <TextInput source="series" />
      <TextInput source="season" />
    </SimpleForm>
  </Create>
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

ReactDOM.render(<App/>, document.querySelector("#root"));
