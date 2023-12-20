import t from "tap";
import { init } from "../../../src";

async function getStore() {
  const store = init({});
  return store;
}

t.test("user should be able to add new note", async (t) => {
  t.plan(2);

  const store = await getStore();
  const notesB4 = store.ui.notes();
  t.equal(notesB4.length, 0);

  store.ui.createNote("hello");
  const notesAfter = store.ui.notes();
  t.same(notesAfter, [{ id: "hello", value: "hello" }]);
});

t.test("user should be able to clear notes", async (t) => {
  t.plan(2);

  const store = await getStore();
  const notesB4 = store.ui.notes();
  store.ui.createNote("hello");
  store.ui.createNote("world");
  t.equal(notesB4.length, 2);

  store.ui.clearNotes();
  const notesAfter = store.ui.notes();
  t.same(notesAfter.length, 0);
});

t.test("user should be able to view notes", async (t) => {
  t.plan(1);

  const store = await getStore();
  store.ui.createNote("hello");
  store.ui.createNote("world");

  const notesAfter = store.ui.notes();
  t.same(notesAfter, [
    { id: "hello", value: "hello" },
    { id: "world", value: "world" },
  ]);
});

t.test("user should be able to remove a note", async (t) => {
  t.plan(2);

  const store = await getStore();
  store.ui.createNote("hello");
  store.ui.createNote("world");
  const notesB4 = store.ui.notes();
  t.equal(notesB4.length, 2);

  store.ui.deleteNote({ id: "hello" });

  const notesAfter = store.ui.notes();
  t.same(notesAfter, [{ id: "world", value: "world" }]);
});

t.test("user should be able to edit a note", async (t) => {
  t.plan(2);

  const store = await getStore();
  store.ui.createNote("hello");
  store.ui.createNote("world");
  store.ui.createNote("3");
  const notesB4 = store.ui.notes();
  t.same(notesB4, [
    { id: "hello", value: "hello" },
    { id: "world", value: "world" },
    { id: "3", value: "3" },
  ]);

  store.ui.editNote({ id: "world" }, { value: "何で？" });

  const notesAfter = store.ui.notes();
  t.same(notesAfter, [
    { id: "hello", value: "hello" },
    { id: "world", value: "何で？" },
    { id: "3", value: "3" },
  ]);
});

t.test("users should be able to retrieve pokemons", async (t) => {
  t.plan(2);

  const store = await getStore();
  await store.ui.fetchPokemons();
  const pokemons = store.ui.pokemons();
  t.same(pokemons, [
    {
      id: "gsfmecwfmaml6p6",
      name: "psyduck",
      type: ["grass"],
    },
  ]);
});
