import { describe, expect, it } from "vitest";
import { resolveSectionValues } from "./mapping";
import { salesforceSectionMap, type SalesforceSectionMap } from "./salesforce-section-map";

const mapped: SalesforceSectionMap = {
  objectApiName: "SolutionDesign__c",
  opportunityLookupField: "Opportunity__c",
  fields: {
    ...salesforceSectionMap.fields,
    coreSolutionHypothesis: "Core_Solution_Hypothesis__c",
    problemToSolve: "Problem_to_Solve__c",
    successCriteria: "Success_Criteria__c",
  },
};

describe("resolveSectionValues", () => {
  it("keeps every section empty when the object is not mapped", () => {
    const values = resolveSectionValues(
      {
        objectApiName: null,
        opportunityLookupField: null,
        fields: salesforceSectionMap.fields,
      },
      { Core_Solution_Hypothesis__c: "Already written" },
    );
    expect(values.coreSolutionHypothesis).toBe("");
    expect(values.problemToSolve).toBe("");
  });

  it("copies filled fields and leaves blank or unmapped sections empty", () => {
    const values = resolveSectionValues(mapped, {
      Core_Solution_Hypothesis__c: "  Engagement Cloud  ",
      Problem_to_Solve__c: "",
      Success_Criteria__c: "Permits issued in one pass",
    });
    expect(values.coreSolutionHypothesis).toBe("Engagement Cloud");
    expect(values.problemToSolve).toBe("");
    expect(values.successCriteria).toBe("Permits issued in one pass");
    expect(values.exclusions).toBe("");
  });
});
