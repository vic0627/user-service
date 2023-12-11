import { describe, expect, it, beforeEach } from "@jest/globals";
import Path from "src/utils/Path.provider";

describe("Path", () => {
  let path: Path;

  beforeEach(() => {
    path = new Path();
  });

  it("should trim start of a path", () => {
    const trimmedPath = path.trimStart("//hello/world/");
    expect(trimmedPath).toBe("hello/world/");
  });

  it("should trim end of a path", () => {
    const trimmedPath = path.trimEnd("/hello/world//");
    expect(trimmedPath).toBe("/hello/world");
  });

  it("should trim both start and end of a path", () => {
    const trimmedPath = path.trim("//hello/world//");
    expect(trimmedPath).toBe("hello/world");
  });

  it("should anti-slash a path", () => {
    const antiSlashedPath = path.antiSlash("/hello/world//");
    expect(antiSlashedPath).toEqual(["hello", "world"]);
  });

  it("should split paths", () => {
    const splitPaths = path.split("https://wtf.com//projects/", "/srgeo/issues//");
    expect(splitPaths).toEqual(["https://wtf.com", "projects", "srgeo", "issues"]);
  });

  it("should join paths", () => {
    const joinedPath = path.join("https://wtf.com//projects/", "/srgeo/issues//");
    expect(joinedPath).toBe("https://wtf.com/projects/srgeo/issues");
  });

  it("should resolve paths", () => {
    const resolvedPath = path.resolve(
      "https://wtf.com/projects/",
      "../../srgeo//issues",
      "./hello/world/",
      "/how//../are/you///",
    );
    expect(resolvedPath).toBe("https://wtf.com/srgeo/issues/hello/world/are/you");
  });

  it("should resolve URL with query parameters", () => {
    const resolvedURL = path.resolveURL({
      paths: ["https://wtf.com/", "/hello", "../world/"],
      query: {
        foo: "bar",
        some: "how",
      },
    });
    expect(resolvedURL).toBe("https://wtf.com/world?foo=bar&some=how");
  });
});
