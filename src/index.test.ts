import { describe, expect, test } from "@jest/globals";
import Stack from "./index";

describe("Stack init", () => {
    test("init with no parameter", () => {
        expect(new Stack()).toEqual({ heap: [] });
    });
    test("init with parameter [1,2,3]", () => {
        expect(new Stack(1, 2, 3)).toEqual({ heap: [1, 2, 3] });
    });
});
