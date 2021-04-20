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

const e = React.createElement;

const dataProvider = jsonServerProvider("http://localhost:12306");

const PatternList = (props) =>
  e(
    List,
    props,
    e(
      Datagrid,
      { rowClick: "edit" },
      e(TextField, { source: "id" }),
      e(TextField, { source: "pattern" }),
      e(TextField, { source: "series" }),
      e(TextField, { source: "season" })
    )
  );

const PatternEdit = (props) =>
  e(
    Edit,
    props,
    e(
      SimpleForm,
      null,
      e(TextInput, { disabled: true, source: "id" }),
      e(TextInput, { source: "pattern" }),
      e(TextInput, { source: "series" }),
      e(TextInput, { source: "season" })
    )
  );

const PatternCreate = (props) =>
  e(
    Create,
    props,
    e(
      SimpleForm,
      null,
      e(TextInput, { disabled: true, source: "id" }),
      e(TextInput, { source: "pattern" }),
      e(TextInput, { source: "series" }),
      e(TextInput, { source: "season" })
    )
  );

const App = () =>
  e(
    React.StrictMode,
    null,
    e(
      Admin,
      { dataProvider },
      e(Resource, {
        name: "patterns",
        list: PatternList,
        edit: PatternEdit,
        create: PatternCreate,
      })
    )
  );

export default App;

ReactDOM.render(e(App, null, null), document.querySelector("#root"));
