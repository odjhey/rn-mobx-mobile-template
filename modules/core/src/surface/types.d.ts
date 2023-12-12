type Note = {
  id: string;
  value: string;
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
