import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { createAppServer } from "../src/server.js";
import { TranscriptStore } from "../src/transcriptStore.js";

describe("BUG-101: deleting a student removes stored grades", () => {
  test("store no longer returns grades of a deleted student", () => {
    const store = new TranscriptStore();
    const studentID = store.addStudent("Ada");
    store.addGrade(studentID, "CS360", 90);

    store.deleteStudent(studentID);

    assert.equal(store.getGrade(studentID, "CS360"), undefined);
  });

  test("grade request for a deleted student returns 404", async () => {
    const server = createAppServer();
    await new Promise((resolve) => server.listen(0, resolve));
    const base = `http://localhost:${server.address().port}`;

    try {
      const created = await fetch(`${base}/transcripts`, {
        method: "POST",
        body: JSON.stringify({ name: "Ada" }),
      }).then((r) => r.json());
      const id = created.studentID;
      await fetch(`${base}/transcripts/${id}/CS360`, {
        method: "POST",
        body: JSON.stringify({ grade: 90 }),
      });
      await fetch(`${base}/transcripts/${id}`, { method: "DELETE" });

      const response = await fetch(`${base}/transcripts/${id}/CS360`);
      assert.equal(response.status, 404);
    } finally {
      server.close();
    }
  });
});