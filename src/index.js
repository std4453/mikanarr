import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  Admin,
  Resource,
  List,
  Datagrid,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
  Create,
  FormDataConsumer,
  AutocompleteInput,
  fetchStart,
  fetchEnd,
  useNotify,
} from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import { Button, InputAdornment } from "@material-ui/core";
import { useForm, useFormState } from "react-final-form";
import * as _ from "lodash";

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

const EscapeButton = () => {
  const form = useForm();
  const formState = useFormState();
  const escape = () =>
    form.change("pattern", _.escapeRegExp(formState.values.pattern));
  return (
    <InputAdornment position="end">
      <Button color="primary" onClick={escape}>
        Escape
      </Button>
    </InputAdornment>
  );
};

const useSeriesChoices = () => {
  const [choices, setChoices] = useState([]);
  const notify = useNotify();
  useEffect(() => {
    (async () => {
      try {
        fetchStart();
        const resp = await fetch(
          `${process.env.REACT_APP_SONARR_API_ROOT}/series?apikey=${process.env.REACT_APP_SONARR_API_KEY}`
        );
        const data = await resp.json();
        setChoices(data.map(({ title }) => ({ id: title, name: title })));
      } catch (e) {
        console.error(e);
        notify(`Fetch Sonarr series failed: ${e.message}`);
      } finally {
        fetchEnd();
      }
    })();
  }, []);
  return choices;
};

const PatternEdit = (props) => {
  const choices = useSeriesChoices();
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput disabled source="id" />
        <TextInput
          fullWidth
          source="pattern"
          InputProps={{
            endAdornment: <EscapeButton />,
          }}
        />
        <AutocompleteInput fullWidth source="series" choices={choices} />
        <TextInput source="season" />
      </SimpleForm>
    </Edit>
  );
};

const PatternCreate = (props) => {
  const choices = [];
  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput disabled source="id" />
        <TextInput
          fullWidth
          source="pattern"
          InputProps={{
            endAdornment: <EscapeButton />,
          }}
        />
        <AutocompleteInput fullWidth source="series" choices={choices} />
        <TextInput source="season" />
      </SimpleForm>
    </Create>
  );
};

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

ReactDOM.render(<App />, document.querySelector("#root"));
