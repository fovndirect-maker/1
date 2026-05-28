export type SbuType = 'IT' | 'non-IT';

export interface SM {
  id: string;
  name: string;
  email: string;
  sbu: SbuType;
  department: string;
}

export interface CareerTrackOption {
  id: string;
  name: string;
  sbu: SbuType;
}

export interface FunctionalDomainOption {
  id: string;
  name: string;
  sbu: SbuType;
}

export interface FunctionSpecialtyOption {
  id: string;
  name: string;
  domainId: string;
}

export interface SelfReflection {
  q1: string; // What made me choose this field?
  q2: string; // How do I view my current position?
  q3: string; // What do I want to become in 12 months?
}

export type JobTrackStatus = 
  | 'Draft'                 // IC is filling information
  | 'Pending co-sign'       // IC submitted, waiting for SM co-sign
  | 'Reviewing'             // SM clicked "Xem xét thêm", waiting for IG meeting
  | 'Escalation'            // Over 48 hours empty action, waiting for IG to call
  | 'Co-signed'             // SM confirmed co-sign
  | 'Auto Co-signed';       // Exceeded 96h, auto co-signed by system

export interface JobTrackRecord {
  id: string;
  icName: string;
  icEmail: string;
  sbu: SbuType;
  assignedSm: SM | null;
  careerTrack: string;
  functionalDomain: string;
  functionalSpecialty: string;
  reflection: SelfReflection;
  declaresCount: number; // to check if reflection questions are optional (1) or compulsory (>= 2)
  status: JobTrackStatus;
  submitTime: number | null; // Date.now() timestamp when submitted
  elapsedHours: number; // simulated elapsed hours from submission
  smNote: string; // SM's REVIEWING concern or notes
  igNotes: string; // IG's meeting log
  igStatusType: 'Delay - operational' | 'SM concern' | 'SM non-responsive' | '';
  historyLogs: HistoryLog[];
}

export interface HistoryLog {
  timestamp: string; // Vietnamese-formatted date or relative simulated hour
  actor: 'IC' | 'SM' | 'IG' | 'Hệ thống';
  action: string;
  details: string;
}

export interface NotificationMsg {
  id: string;
  type: 'InApp' | 'dLink';
  title: string;
  content: string;
  timestamp: string;
  linkText?: string;
  isRead: boolean;
  receiver: 'IC' | 'SM' | 'IG';
}
