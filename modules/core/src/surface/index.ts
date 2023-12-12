import { createMiddleware, createStore, setup } from "../models/setup";

// TODO: should init return a "loading" state?
// TODO: add manual return type of our object, reason being, is that we are exposing these and we don't want to leak the internals,
//       ideally we use toJS or some serialization, but since we lazy, lets just hide via types

const init = async ({
  storage,
}: {
  storage?: {
    // TODO: question, should this be a generic type? is string fine?
    getItem: () => Promise<object>;
    setItem: (value: object) => Promise<unknown>;
  };
}) => {
  const storageMiddlewares = storage
    ? [
        createMiddleware(({ applySnapshot }) => async (store) => {
          await storage.getItem().then((snap) => {
            // TODO: handle error
            if (snap) {
              applySnapshot(store, snap);
            }
          });

          return store;
        }),
        createMiddleware(({ onSnapshot }) => async (store) => {
          onSnapshot(store, (snap) => {
            storage.setItem(snap);
          });

          return store;
        }),
      ]
    : [];

  const store = await setup(createStore(), [...storageMiddlewares]);

  const ui: NoteActions & NoteViews = {
    createNote: (value: string) => {
      return store.userspace.ui.addNote(value);
    },
    notes: () => {
      return store.userspace.ui.notes();
    },
    editNote: ({ id }: { id: string }, { value }: { value: string }) => {
      return store.userspace.ui.updateNote({ id }, { value });
    },
    clearNotes: () => {
      return store.userspace.ui.clear();
    },
    deleteNote: ({ id }: { id: string }) => {
      return store.userspace.ui.removeNote(id);
    },
  };

  return {
    ui,
  };
};

export type Store = Awaited<ReturnType<typeof init>>;
export { init };
