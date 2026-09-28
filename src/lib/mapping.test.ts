import { describe, expect, it } from "vitest";
import { resolveSectionValues } from "./mapping";
import type { SalesforceSectionMap } from "./salesforce-section-map";

const mapped: SalesforceSectionMap = {
  objectApiName: "SolutionDesign__c",
  opportunityLookupField: "Opportunity__c",
  fields: {
    futureOutcome: "Future_Outcome__c",
    currentState: "Current_State__c",
    futureState: null,
    successMeasure: "Success_Measure__c",
    workflow: null,
  },
};

describe("resolveSectionValues", () => {
  it("keeps every section empty when the object is not mapped", () => {
    const values = resolveSectionValues(
      {
        objectApiName: null,
        opportunityLookupField: null,
        fields: {
          futureOutcome: null,
          currentState: null,
          futureState: null,
          successMeasure: null,
          workflow: null,
        },
      },
      { Future_Outcome__c: "Already written" },
    );
    expect(values.futureOutcome).toBe("");
    expect(values.workflow).toBe("");
  });

  it("copies filled fields and leaves blank or unmapped sections empty", () => {
    const values = resolveSectionValues(mapped, {
      Future_Outcome__c: "  Ship the same day  ",
      Current_State__c: "",
      Success_Measure__c: "Exceptions close in one pass",
    });
    expect(values.futureOutcome).toBe("Ship the same day");
    expect(values.currentState).toBe("");
    expect(values.futureState).toBe("");
    expect(values.successMeasure).toBe("Exceptions close in one pass");
    expect(values.workflow).toBe("");
  });
});
