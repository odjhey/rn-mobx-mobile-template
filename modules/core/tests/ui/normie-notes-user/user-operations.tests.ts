import t from "tap";
import { createStore, setup } from "../../../src";

async function getStore() {
  const store = createStore();
  return setup(store, []);
}

t.test("user should be able to add new note", async (t) => {
  t.plan(2);

  const store = await getStore();
  const notesB4 = store.userspace.ui.notes();
  t.equal(notesB4.length, 0);

  store.userspace.ui.addNote("hello");
  const notesAfter = store.userspace.ui.notes();
  t.same(notesAfter, [{ id: "hello", value: "hello" }]);
});

t.test("user should be able to clear notes", async (t) => {
  t.plan(2);

  const store = await getStore();
  const notesB4 = store.userspace.ui.notes();
  store.userspace.ui.addNote("hello");
  store.userspace.ui.addNote("world");
  t.equal(notesB4.length, 2);

  store.userspace.ui.clear();
  const notesAfter = store.userspace.ui.notes();
  t.same(notesAfter.length, 0);
});

t.test("user should be able to view notes", async (t) => {
  t.plan(1);

  const store = await getStore();
  store.userspace.ui.addNote("hello");
  store.userspace.ui.addNote("world");

  const notesAfter = store.userspace.ui.notes();
  t.same(notesAfter, [
    { id: "hello", value: "hello" },
    { id: "world", value: "world" },
  ]);
});
