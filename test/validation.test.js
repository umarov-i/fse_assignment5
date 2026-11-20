import assert from "node:assert/strict";
import { beforeEach, describe, test } from "node:test";
import { TranscriptStore } from "../src/transcriptStore.js";

describe("REF-201: course and grade validation behavior", () => {
  let store;
  let studentID;

  beforeEach(() => {
    store = new TranscriptStore();
    studentID = store.addStudent("Noah");
    store.addGrade(studentID, "CS360", 80);
  });

  test("addGrade and changeGrade reject an empty course the same way", () => {
    assert.throws(() => store.addGrade(studentID, "  ", 90), /Course name is required/);
    assert.throws(() => store.changeGrade(studentID, undefined, 90), /Course name is required/);
  });

  test("addGrade and changeGrade reject invalid grades the same way", () => {
    for (const bad of [-1, 101, 85.5, "abc"]) {
      assert.throws(() => store.addGrade(studentID, "CS101", bad), /Grade must be an integer from 0 to 100/);
      assert.throws(() => store.changeGrade(studentID, "CS360", bad), /Grade must be an integer from 0 to 100/);
    }
  });

  test("course names are normalized to trimmed upper case", () => {
    assert.deepEqual(store.addGrade(studentID, " cs101 ", "70"), {
      studentID,
      course: "CS101",
      grade: 70,
    });
    assert.equal(store.getGrade(studentID, " cs101"), 70);
  });

  test("changeGrade on a missing grade still reports not found", () => {
    assert.throws(() => store.changeGrade(studentID, "CS999", 50), /Grade not found for course CS999/);
  });
});