import { Button, InputAdornment, makeStyles } from "@material-ui/core";
import axios from "axios";
import clsx from "clsx";
import * as _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import {
  AutocompleteInput,
  Create,
  Edit,
  SelectInput,
  SimpleForm,
  TextInput,
  useNotify,
} from "react-admin";
import { useForm, useFormState } from "react-final-form";
import useSWR from "swr";
import { useClipboard } from "use-clipboard-copy";
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
  const { data } = await axios(`/sonarr${api}`);
  return data;
};

const useSeries = () => {
  const notify = useNotify();
  const { data: series } = useSWR("/series", choicesFetcher, {
    fallbackData: [],
    onError: (e) => {
      console.error(e);
      notify(`Fetch Sonarr series failed: ${e.message}`);
    },
  });
  return series;
};

const useStylesSeasonChoice = makeStyles({
  monitoring: {
    display: "inline-block",
    verticalAlign: "middle",
    width: 8,
    height: 8,
    borderRadius: "50%",
    marginRight: 8,
    backgroundColor: "green",
    "&$unmonitored": {
      backgroundColor: "red",
    },
  },
  unmonitored: {},
});

const SeasonChoice = ({ record: { monitored, seasonNumber } }) => {
  const styles = useStylesSeasonChoice();
  return (
    <div>
      <div
        className={clsx(styles.monitoring, {
          [styles.unmonitored]: !monitored,
        })}
      />
      {`${seasonNumber}`.padStart(2, "0")}{" "}
    </div>
  );
};

const SeasonsInput = ({ series }) => {
  const state = useFormState();
  const seriesTitle = state.values?.series;
  const seasonChoices = useMemo(
    () =>
      series
        ?.find(({ title }) => title === seriesTitle)
        ?.seasons?.map(({ seasonNumber, monitored }) => ({
          id: `${seasonNumber}`.padStart(2, "0"),
          seasonNumber,
          monitored,
        })),
    [series, seriesTitle]
  );

  return (
    <SelectInput
      source="season"
      choices={seasonChoices}
      optionText={<SeasonChoice />}
    />
  );
};

const PatternEdit = (props) => {
  const clipboard = useClipboard();
  const notify = useNotify();

  const series = useSeries();
  const choices = useMemo(
    () =>
      series.map(({ title }) => ({
        id: title,
        name: title,
      })),
    [series]
  );

  return (
    <Edit {...props} aside={<Aside />}>
      <SimpleForm>
        <TextInput disabled source="id" />
        <TextInput
          fullWidth
          source="pattern"
          InputProps={{
            endAdornment: (
              <>
                <EscapeButton />
                <Button
                  color="primary"
                  onClick={() => {
                    clipboard.copy("(?<episode>\\d+)");
                    notify("Episode pattern copied");
                  }}
                >
                  Episode
                </Button>
              </>
            ),
          }}
        />
        <AutocompleteInput fullWidth source="series" choices={choices} />
        <SeasonsInput series={series} />
        <TextInput source="language" />
        <TextInput source="quality" />
      </SimpleForm>
    </Edit>
  );
};

const patternDefaultValue = () => ({
  language: "Chinese",
  quality: "WEBDL 1080p",
});

const PatternCreate = (props) => {
  const clipboard = useClipboard();
  const notify = useNotify();
  const series = useSeries();
  const choices = useMemo(
    () =>
      series.map(({ title }) => ({
        id: title,
        name: title,
      })),
    [series]
  );
  return (
    <Create {...props} aside={<Aside />}>
      <SimpleForm initialValues={patternDefaultValue}>
        <TextInput disabled source="id" />
        <TextInput
          fullWidth
          source="pattern"
          InputProps={{
            endAdornment: (
              <>
                <EscapeButton />
                <Button
                  color="primary"
                  onClick={() => {
                    clipboard.copy("(?<episode>\\d+)");
                    notify("Episode pattern copied");
                  }}
                >
                  Episode
                </Button>
              </>
            ),
          }}
        />
        <AutocompleteInput fullWidth source="series" choices={choices} />
        <TextInput source="season" />
        <TextInput source="language" />
        <TextInput source="quality" />
      </SimpleForm>
    </Create>
  );
};

export { PatternCreate, PatternEdit };
