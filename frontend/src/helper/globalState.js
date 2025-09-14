import { createGlobalState } from "react-hooks-global-state";

const { setGlobalState, useGlobalState, getGlobalState } = createGlobalState({
  user: null,
  token: null,
  vehicles: [],
  totalUnread: 0,
});

export { useGlobalState, setGlobalState, getGlobalState };
