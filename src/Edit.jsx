import { Button, InputAdornment } from "@material-ui/core";
import axios from "axios";
import * as _ from "lodash";
import React from "react";
import {
  AutocompleteInput,
  Create,
  Edit,
  SimpleForm,
  TextInput,
  useNotify,
} from "react-admin";
import { useForm, useFormState } from "react-final-form";
import useSWR from "swr";
import Aside from "./Aside";

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

const choicesFetcher = async (api) => {
  const { data } = await axios(
    `${process.env.REACT_APP_SONARR_API_ROOT}${api}?apikey=${process.env.REACT_APP_SONARR_API_KEY}`
  );
  return data.map(({ title }) => ({ id: title, name: title }));
};

const useSeriesChoices = () => {
  const notify = useNotify();
  const { data: choices } = useSWR("/series", choicesFetcher, {
    onError: (err) => {
      console.error(e);
      notify(`Fetch Sonarr series failed: ${e.message}`);
    },
  });
  return choices;
};

const PatternEdit = (props) => {
  const choices = useSeriesChoices();
  return (
    <Edit {...props} aside={<Aside/>}>
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
  const choices = useSeriesChoices();
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

export { PatternCreate, PatternEdit };
