import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Typography,
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import axios from "axios";
import _ from "lodash";
import { useNotify } from "ra-core";
import { useEffect, useMemo } from "react";
import useSWR from "swr";
import { useBus, useBusField } from "./Bus";
import clsx from "clsx";

const fetcher = async (url) => {
  // use a proxy to bypass CORS
  const { data } = await axios.get(
    new URL(`/proxy?url=${encodeURIComponent(url)}`, location.href).href
  );
  return data;
};

const useStyles = makeStyles((theme) => ({
  matched: {
    color: '#1976d2',
  },
}));

const Aside = () => {
  const notify = useNotify();
  const bus = useBus();

  const url = useBusField("url");

  const { data, mutate, isValidating } = useSWR(url, fetcher, {
    fallbackData: [],
    onError: (e, url) => {
      notify(`Unable to fetch proxy for '${url}': ${e.message}`);
    },
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  useEffect(() => {
    if (!bus) return;
    const listener = () => mutate(undefined, true);
    bus.on("refresh", listener);
    return () => {
      bus.off("refresh", listener);
    };
  }, [bus, mutate]);

  const patternString = useBusField("pattern") ?? "";
  const patternRegex = useMemo(() => {
    try {
      return new RegExp(`^${patternString}$`);
    } catch (e) {
      // invalid regex
      return null;
    }
  }, [patternString]);
  const matchedData = useMemo(() => {
    return data.map((title) => ({
      title,
      matched: patternRegex && Boolean(title.match(patternRegex)),
    }));
  }, [patternRegex, data]);

  const styles = useStyles();

  return (
    <Card style={{ marginLeft: 20 }}>
      <CardContent style={{ height: "75vh", position: "relative" }}>
        <div
          style={{
            position: "relative",
            width: 400,
            height: "100%",
            overflow: "auto",
          }}
        >
          {matchedData.length > 0 ? (
            <List>
              {matchedData.map(({ title, matched }, i) => (
                <ListItem
                  button
                  key={i}
                  dense
                  disableGutters
                  divider
                  onClick={() => {
                    bus?.emit("item", title);
                  }}
                >
                  <ListItemText
                    primary={title}
                    className={clsx({
                      [styles.matched]: matched,
                    })}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <div
              style={{
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                left: 0,
                top: 0,
                right: 0,
                height: "100%",
              }}
            >
              <Typography>Enter RSS URL to fetch</Typography>
            </div>
          )}
        </div>
        {isValidating && (
          <div
            style={{
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.5)",
            }}
          >
            <CircularProgress />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Aside;
