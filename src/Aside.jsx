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

const fetcher = async (url) => {
  const { data } = await axios.get(
    new URL(`/proxy?url=${encodeURIComponent(url)}`, location.href).href
  );
  return data;
};

const Aside = () => {
  const { control, handleSubmit } = useForm();
  const [url, setUrl] = useState(null);
  const onSubmit = (data) => {
    setUrl(data.url);
  };
  const { data } = useSWR(url, fetcher);
  const clipboard = useClipboard();
  const notify = useNotify();

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
                  render={({ field }) => (
                    <TextField fullWidth placeholder="URL" {...field} />
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
                      notify('Title copied');
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
