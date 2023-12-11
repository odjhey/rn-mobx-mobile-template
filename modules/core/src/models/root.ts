import { Instance, types } from "mobx-state-tree";

const Note = types.model("Note", {
  id: types.identifier,
  value: types.string,
});

export const State = types
  .model("State", {
    id: types.identifier,
    notes: types.array(Note),
  })
  .actions((self) => ({
    addNote: (value: string) => {
      self.notes.push({ id: value, value });
    },
  }));

export const Ui = types.model("Ui", {
  stateRef: types.reference(State),
  activeNote: types.maybeNull(types.reference(Note)),
});

// TODO: Rethink if we include Userspace and Ui in this module.
//       For now, lets include, and split siguro later if needed
const Userspace = types.model("Userspace", {
  state: State,
  ui: Ui,
});

export const RootStore = types.model("RootStore", {
  userspace: Userspace,
});

export type TRootStore = Instance<typeof RootStore>;
