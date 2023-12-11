import {
  SnapshotIn,
  castToReferenceSnapshot,
  castToSnapshot,
  onSnapshot,
  applySnapshot,
} from "mobx-state-tree";
import { RootStore, State, TRootStore } from "./root";
// import { applySnapshot, onSnapshot } from "mobx-state-tree";

export type StoreMiddleware = (
  store: TRootStore,
) => TRootStore | Promise<TRootStore>;
export const createMiddleware = (
  fn: (helpers: {
    // TODO: narrow scope of these helpers, do not bleed mobx-state-tree stuff
    onSnapshot: typeof onSnapshot;
    applySnapshot: typeof applySnapshot;
  }) => StoreMiddleware,
) => {
  return fn({ onSnapshot, applySnapshot });
};

export const createStore = (value?: SnapshotIn<TRootStore>): TRootStore => {
  const state = State.create({
    id: "default",
  });
  return RootStore.create(
    value || {
      userspace: {
        state: castToSnapshot(state),
        ui: { stateRef: castToReferenceSnapshot(state) },
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
