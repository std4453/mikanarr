import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

const BusContext = createContext(null);

export const BusProvider = ({ children }) => {
  const listenersRef = useRef([]);
  const on = useCallback((event, listener) => {
    listenersRef.current.push({
      event,
      listener,
    });
  }, []);
  const off = useCallback((_event, _listener) => {
    const index = listenersRef.current.findIndex(
      ({ event, listener }) => event === _event && listener === _listener
    );
    if (index >= 0) {
      listenersRef.current.splice(index, 1);
    }
  }, []);
  const emit = useCallback((_event, arg) => {
    listenersRef.current
      .filter(({ event }) => event === _event)
      .forEach(({ listener }) => listener?.(arg));
  }, []);
  const [fields, setFields] = useState({});
  const setField = useCallback((name, value) => {
    setFields((fields) => ({
      ...fields,
      [name]: value,
    }));
  }, []);
  const bus = useMemo(
    () => ({
      on,
      off,
      emit,
      setField,
    }),
    [on, off, emit, setField]
  );
  return <BusContext.Provider value={{
    bus,
    fields,
  }}>{children}</BusContext.Provider>;
};

export const useBus = () => useContext(BusContext).bus;

export const useBusField = (name) => useContext(BusContext).fields[name];
