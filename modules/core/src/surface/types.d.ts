type Note = {
  id: string;
  value: string;
};
type Pokemon = {
  id: string;
  name: string;
  type: string[];
};

// TODO: fix returns
type NoteActions = {
  createNote: (value: string) => void;
  editNote: (key: { id: string }, value: { value: string }) => void;
  clearNotes: () => void;
  deleteNote: (key: { id: string }) => void;
};

type NoteViews = {
  notes: () => Note[];
};

type PokemonViews = {
  pokemons: () => Pokemon[];
};
type PokemonActions = {
  fetchPokemons: () => Promise<void>;
};
