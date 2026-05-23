/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SeverityType = "Low" | "Medium" | "High";
export type PriorityType = "Low" | "Medium" | "High";
export type BatchStatusType = "Processing" | "Completed" | "Draft" | "Needs Review";

export interface DecisionItem {
  decision: string;
  owner: string;
  deadline: string;
}

export interface RiskConcernItem {
  risk: string;
  impact: string;
  severity: SeverityType;
  mitigation: string;
}

export interface TalkingPoints {
  internal: string[];
  stakeholder_client: string[];
  leadership: string[];
}

export interface NextStepItem {
  action_item: string;
  owner?: string;
  deadline?: string;
  priority: PriorityType;
  completed?: boolean; // tracking completion in client state
}

export interface MeetingIntelligence {
  generationSource?: "ai" | "fallback" | "pre-baked";
  extractedCharactersCount?: number;
  extractedFileCount?: number;
  key_takeaways: string[];
  meeting_summary: string[];
  decisions: DecisionItem[];
  risks_concerns: RiskConcernItem[];
  talking_points: TalkingPoints;
  next_steps: NextStepItem[];
  open_questions: string[];
  follow_up_message: string;
}

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export interface MeetingBatch {
  id: string;
  title: string;
  dateCreated: string;
  filesCount: number;
  fileTypes: string[];
  insightPreview: string;
  status: BatchStatusType;
  intelligence?: MeetingIntelligence;
  uploadedFiles: UploadedFile[];
  notesSnippet?: string;
}
