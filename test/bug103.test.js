import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { TranscriptStore } from "../src/transcriptStore.js";

describe("BUG-103: name search trims whitespace and ignores case", () => {
  test("finds a student regardless of case and surrounding whitespace", () => {
    const store = new TranscriptStore();
    const id = store.addStudent("Grace Lee");

    assert.deepEqual(store.getStudentIDs("  grace lee  "), [id]);
    assert.deepEqual(store.getStudentIDs("GRACE LEE"), [id]);
  });

  test("stored display name is unchanged", () => {
    const store = new TranscriptStore();
    const id = store.addStudent("Grace Lee");

    store.getStudentIDs("  grace lee ");
    assert.equal(store.getTranscript(id).student.studentName, "Grace Lee");
  });

  test("searching without a name still returns all students", () => {
    const store = new TranscriptStore();
    const a = store.addStudent("Ada");
    const b = store.addStudent("Lin");

    assert.deepEqual(store.getStudentIDs(), [a, b]);
  });
});