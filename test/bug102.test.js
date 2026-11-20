import assert from "node:assert/strict";
import { beforeEach, describe, test } from "node:test";
import { TranscriptStore } from "../src/transcriptStore.js";

describe("BUG-102: duplicate grade for the same student and course", () => {
  let store;
  let studentID;

  beforeEach(() => {
    store = new TranscriptStore();
    studentID = store.addStudent("Lin");
    store.addGrade(studentID, "CS360", 85);
  });

  test("second addGrade for the same course throws", () => {
    assert.throws(
      () => store.addGrade(studentID, "CS360", 70),
      /Grade already exists for course CS360/,
    );
  });

  test("duplicate check ignores course case and whitespace, and keeps original grade", () => {
    assert.throws(
      () => store.addGrade(studentID, " cs360 ", 70),
      /Grade already exists for course CS360/,
    );
    assert.equal(store.getGrade(studentID, "CS360"), 85);
  });

  test("changeGrade still corrects an existing grade", () => {
    store.changeGrade(studentID, "CS360", 95);
    assert.equal(store.getGrade(studentID, "CS360"), 95);
  });
});