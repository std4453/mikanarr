import { Button, Grid, InputAdornment, makeStyles } from "@material-ui/core";
import axios from "axios";
import clsx from "clsx";
import * as _ from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { BusProvider, useBus } from "./Bus";

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
  const opt = localStorage.getItem("token") ? {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    }
  } : {};
  const { data } = await axios(`/sonarr${api}`, opt);
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

const RefreshButton = () => {
  const bus = useBus();

  const onClick = useCallback(() => {
    bus?.emit("refresh");
  }, []);

  return (
    <Button color="primary" onClick={onClick}>
      Refresh
    </Button>
  );
};

const ProxyButton = () => {
  const clipboard = useClipboard();
  const state = useFormState();
  const remote = state.values?.remote ?? "";
  const notify = useNotify();

  return (
    <Button
      color="primary"
      onClick={() => {
        if (!remote) {
          notify("No remote link to proxy");
        } else {
          const proxy = remote.replace(
            "https://mikanani.me",
            `${location.protocol}//${location.host}`
          );
          clipboard.copy(proxy);
          notify("Proxied RSS link copied");
        }
      }}
    >
      Proxy
    </Button>
  );
};

const RemoteInput = () => {
  const state = useFormState();
  const remote = state.values?.remote ?? "";
  const bus = useBus();
  const onFetch = useMemo(
    () =>
      _.debounce((remote) => {
        bus?.setField("url", remote);
      }, 1000),
    [bus]
  );
  useEffect(() => {
    onFetch(remote);
  }, [remote, onFetch]);

  return (
    <TextInput
      fullWidth
      source="remote"
      type="url"
      InputProps={{
        endAdornment: (
          <>
            <RefreshButton />
            <ProxyButton />
          </>
        ),
      }}
    />
  );
};

const PatternInput = () => {
  const clipboard = useClipboard();
  const notify = useNotify();
  const form = useForm();

  const bus = useBus();
  useEffect(() => {
    if (!bus) return;
    const listener = (title) => {
      form.change("pattern", _.escapeRegExp(title));
      notify("Replaced pattern with selected item");
    };
    bus.on("item", listener);
    return () => {
      bus.off("item", listener);
    };
  }, [bus]);

  const state = useFormState();
  const pattern = state.values?.pattern ?? "";
  useEffect(() => {
    bus?.setField("pattern", pattern);
  }, [pattern, bus]);

  return (
    <TextInput
      multiline
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
      onBlur
    />
  );
};

const PatternEdit = (props) => {
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
    <BusProvider>
      <Edit {...props} aside={<Aside />}>
        <SimpleForm>
          <TextInput disabled source="id" />
          <RemoteInput />
          <PatternInput />
          <AutocompleteInput fullWidth source="series" choices={choices} />
          <SeasonsInput series={series} />
          <TextInput source="offset" />
          <TextInput source="language" />
          <TextInput source="quality" />
        </SimpleForm>
      </Edit>
    </BusProvider>
  );
};

const patternDefaultValue = () => ({
  language: "Chinese",
  quality: "WEBDL 1080p",
});

const PatternCreate = (props) => {
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
    <BusProvider>
      <Create {...props} aside={<Aside />}>
        <SimpleForm initialValues={patternDefaultValue}>
          <TextInput disabled source="id" />
          <RemoteInput />
          <PatternInput />
          <AutocompleteInput fullWidth source="series" choices={choices} />
          <SeasonsInput series={series} />
          <TextInput source="offset" />
          <TextInput source="language" />
          <TextInput source="quality" />
        </SimpleForm>
      </Create>
    </BusProvider>
  );
};

export { PatternCreate, PatternEdit };
