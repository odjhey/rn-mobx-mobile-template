import {
  SnapshotIn,
  castToReferenceSnapshot,
  castToSnapshot,
} from "mobx-state-tree";
import { RootStore, State, TRootStore } from "./root";
// import { applySnapshot, onSnapshot } from "mobx-state-tree";

type StoreMiddleware = (store: TRootStore) => TRootStore | Promise<TRootStore>;

export const createStore = (value?: SnapshotIn<TRootStore>): TRootStore => {
  const state = State.create({
    id: "default",
    notes: [
      {
        id: "alsdkjf",
        value: "alsdkjf",
      },
      {
        id: "123",
        value: "123",
      },
    ],
  });
  return RootStore.create(
    value || {
      userspace: {
        state: castToSnapshot(state),
        ui: { stateRef: castToReferenceSnapshot(state), activeNote: "123" },
      },
    },
  );
};

export const setup = async (
  store: TRootStore,
  middlewares: StoreMiddleware[],
): Promise<TRootStore> => {
  return middlewares.reduce((p, c) => {
    return p.then((x) => c(x));
  }, Promise.resolve(store));
};

/*
// version up when the model have breaking changes
const ROOTSTORE_KEY = "rootStore-kinkou-v0";
export const loadFromStorage: StoreMiddleware = async (store) => {
  await localforage.getItem(ROOTSTORE_KEY).then((snap) => {
    if (snap) {
      applySnapshot(store, snap);
    }
  });

  return store;
};

export const saveOnChange: StoreMiddleware = (store) => {
  onSnapshot(store, (snap) => {
    localforage.setItem(ROOTSTORE_KEY, snap);
  });

  return store;
};
*/
