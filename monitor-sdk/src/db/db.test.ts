import { customizedDB } from "./index";

describe("indexDB test", () => {
  test("new IndexDB", () => {
    const indexDB = new customizedDB(null);
    indexDB.initdb({
      dbname: "testDB",
      version: 1,
      description: "testDB",
    });
  });
});
