import { Instance, destroy, flow, types } from "mobx-state-tree";
import * as PokemonApi from "../fetch/pokemons";

const Note = types
  .model("Note", {
    id: types.identifier,
    value: types.string,
  })
  .actions((self) => ({
    updateValue: (value: string) => {
      self.value = value;
    },
  }));

const Pokemon = types.model("Pokemon", {
  id: types.identifier,
  name: types.string,
  type: types.array(types.string),
});

export const State = types
  .model("State", {
    id: types.identifier,
    notes: types.array(Note),
    pokemons: types.map(Pokemon),
  })
  .actions((self) => ({
    fetchPokemons: flow(function* fetchPokemons() {
      self.pokemons = yield PokemonApi.fetchPokemons((path, method) =>
        fetch(`http://127.0.0.1:9090/${path}`, {
          method,
          headers: {
            "Content-Type": "application/json",
            // TODO: fix this hard coded
            Authorization: "Bearer asdf",
          },
        }).then((res) => res.json()),
      ).then((res: unknown[]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return Object.fromEntries(res.map((v) => [(v as any).id, v]));
      });
    }),

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
    updateNoteById: ({ id }: { id: string }, { value }: { value: string }) => {
      const match = self.notes.find((note) => note.id === id);
      if (match) {
        match.updateValue(value);
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
    pokemons: () => {
      return [...self.stateRef.pokemons.values()];
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
    updateNote: ({ id }: { id: string }, { value }: { value: string }) => {
      self.stateRef.updateNoteById({ id }, { value });
    },
    clear: () => {
      self.stateRef.clear();
    },
    fetchPokemons: () => {
      return self.stateRef.fetchPokemons();
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
