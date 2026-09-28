import type { SectionId, SectionStatus } from "./sections";

export type StoredSection = {
  id: SectionId;
  content: string;
  status: SectionStatus;
  sourceNote: string;
};

export type WorkingDesign = {
  opportunityId: string;
  opportunityName: string;
  accountName: string;
  stageName: string;
  sections: StoredSection[];
  updatedAt: string;
};
