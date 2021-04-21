import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Grid,
  Button,
  Card,
  CardContent,
  TextField,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import useSWR from "swr";
import axios from "axios";
import { useClipboard } from "use-clipboard-copy";
import { useNotify } from "ra-core";
import { Autocomplete } from "@material-ui/lab";
import store from "store";

const fetcher = async (url) => {
  // use a proxy to bypass CORS
  const { data } = await axios.get(
    new URL(`/proxy?url=${encodeURIComponent(url)}`, location.href).href
  );
  return data;
};

const Aside = () => {
  const [history, setHistory] = useState(store.get("url_history") ?? []);
  const { control, handleSubmit } = useForm();
  const [url, setUrl] = useState(null);
  const clipboard = useClipboard();
  const notify = useNotify();
  const { data, revalidate } = useSWR(url, fetcher, {
    onError: (e, url) => {
      notify(`Unable to fetch proxy for '${url}': ${e.message}`);
    },
  });
  const onSubmit = (data) => {
    setUrl(data.url);
    let newHistory = history.filter((url) => url !== data.url);
    newHistory.push(data.url);
    newHistory = newHistory.slice(0, 20); // keep only 20 entries
    setHistory(newHistory);
    store.set("url_history", newHistory);
  };

  return (
    <Card style={{ marginLeft: 20 }}>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container direction="column" spacing={1}>
            <Grid item container direction="row" spacing={1}>
              <Grid item xs>
                <Controller
                  name="url"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { value, name, ref, onBlur, onChange },
                  }) => (
                    <Autocomplete
                      freeSolo
                      name={name}
                      ref={ref}
                      onBlur={onBlur}
                      inputValue={value}
                      onInputChange={(event, value) =>
                        onChange({ target: { value } })
                      }
                      options={history}
                      renderInput={(params) => (
                        <TextField fullWidth placeholder="URL" {...params} />
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Button type="submit" color="primary">
                  Fetch
                </Button>
              </Grid>
            </Grid>
            <Grid
              item
              style={{
                position: "relative",
                width: 400,
                maxHeight: "80vh",
                overflow: "auto",
              }}
            >
              <List>
                {(data ?? []).map((title, i) => (
                  <ListItem
                    button
                    key={i}
                    dense
                    disableGutters
                    divider
                    onClick={() => {
                      clipboard.copy(title);
                      notify("Title copied");
                    }}
                  >
                    <ListItemText primary={title} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default Aside;
