import { describe, expect, it } from "vitest";
import { isSalesforceId, soqlLikeContains, soqlString } from "./soql";

describe("soql", () => {
  it("escapes quotes in string literals", () => {
    expect(soqlString("O'Hare")).toBe("'O\\'Hare'");
  });

  it("escapes like wildcards", () => {
    expect(soqlLikeContains("100%_done")).toBe("'%100\\%\\_done%'");
  });

  it("accepts 15 and 18 character Salesforce ids", () => {
    expect(isSalesforceId("006000000000001")).toBe(true);
    expect(isSalesforceId("006000000000001AAA")).toBe(true);
    expect(isSalesforceId("sample-northwind-platform")).toBe(false);
  });
});
