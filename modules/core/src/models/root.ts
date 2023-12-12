import { Instance, destroy, types } from "mobx-state-tree";

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
    clear: () => {
      self.notes.clear();
    },
    removeNoteById: (id: string) => {
      const match = self.notes.find((note) => note.id === id);
      if (match) {
        destroy(match);
      }
    },
  }));

export const Ui = types
  .model("Ui", {
    stateRef: types.reference(State),
    activeNote: types.maybeNull(types.reference(Note)),
  })
  .views((self) => ({
    notes: () => {
      return self.stateRef.notes;
    },
  }))
  .actions((self) => ({
    setActiveNote: (value: string) => {
      const match = self.stateRef.notes.find((note) => note.id === value);
      if (match) {
        self.activeNote = match;
      }
    },
    addNote: (value: string) => {
      self.stateRef.addNote(value);
    },
    removeNote: (id: string) => {
      self.stateRef.removeNoteById(id);
    },
    clear: () => {
      self.stateRef.clear();
    },
  }));

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
