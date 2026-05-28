import { SM, CareerTrackOption, FunctionalDomainOption, FunctionSpecialtyOption } from './types';

// Mock SM directory matching SBU
export const SM_DIRECTORY: SM[] = [
  // IT SBU Managers
  {
    id: 'sm-it-1',
    name: 'Nguyễn Minh Quân',
    email: 'quan.nm@vndirect.com.vn',
    sbu: 'IT',
    department: 'Software Engineering Management'
  },
  {
    id: 'sm-it-2',
    name: 'Phạm Thị Thùy Linh',
    email: 'linh.ptt@vndirect.com.vn',
    sbu: 'IT',
    department: 'Data Management & Engineering'
  },
  {
    id: 'sm-it-3',
    name: 'Trần Hoàng Bách',
    email: 'bach.th@vndirect.com.vn',
    sbu: 'IT',
    department: 'Security & Cloud Infrastructure'
  },
  {
    id: 'sm-it-4',
    name: 'Vũ Đức Hiếu',
    email: 'hieu.vd@vndirect.com.vn',
    sbu: 'IT',
    department: 'Product Development & Management'
  },
  // Non-IT SBU Managers
  {
    id: 'sm-nit-1',
    name: 'Lê Thanh Bình',
    email: 'binh.lt@vndirect.com.vn',
    sbu: 'non-IT',
    department: 'Wealth Management Operations'
  },
  {
    id: 'sm-nit-2',
    name: 'Hoàng Kim Chi',
    email: 'chi.hk@vndirect.com.vn',
    sbu: 'non-IT',
    department: 'Customer Services & Relations'
  },
  {
    id: 'sm-nit-3',
    name: 'Đặng Ngọc Minh',
    email: 'minh.dn@vndirect.com.vn',
    sbu: 'non-IT',
    department: 'Finance & Risk Management'
  },
  {
    id: 'sm-nit-4',
    name: 'Đỗ Hồng Thắm',
    email: 'tham.dh@vndirect.com.vn',
    sbu: 'non-IT',
    department: 'Talent Acquisition & Culture'
  }
];

// Career Track Options matching SBU type
export const CAREER_TRACKS: CareerTrackOption[] = [
  // IT Tracks
  { id: 'ct-it-1', name: 'Software Development & Architecture', sbu: 'IT' },
  { id: 'ct-it-2', name: 'Data Engineering & AI Research', sbu: 'IT' },
  { id: 'ct-it-3', name: 'Quality Assurance & Automated Testing', sbu: 'IT' },
  { id: 'ct-it-4', name: 'Cloud Operations & Cyber Security', sbu: 'IT' },
  
  // Non-IT Tracks
  { id: 'ct-nit-1', name: 'Financial Consulting & Wealth Advising', sbu: 'non-IT' },
  { id: 'ct-nit-2', name: 'Operations Excellence & Customer Experience', sbu: 'non-IT' },
  { id: 'ct-nit-3', name: 'Human Resources & Corporate Governance', sbu: 'non-IT' },
  { id: 'ct-nit-4', name: 'Marketing & Digital Communication Strategy', sbu: 'non-IT' }
];

// Functional Domain Options filtered by SBU type (for visual cascade selection)
export const FUNCTIONAL_DOMAINS: FunctionalDomainOption[] = [
  // IT Functional Domains
  { id: 'fd-it-fe', name: 'Front-End Engineering & Interaction Spec', sbu: 'IT' },
  { id: 'fd-it-be', name: 'Back-End & Core Trading Systems Engineering', sbu: 'IT' },
  { id: 'fd-it-de', name: 'Big Data Pipeline Engineering & Analytics', sbu: 'IT' },
  { id: 'fd-it-qa', name: 'Software Verification, QA & Automation', sbu: 'IT' },
  { id: 'fd-it-sec', name: 'Cyber Defensive Controls & Security Assessment', sbu: 'IT' },

  // Non-IT Functional Domains
  { id: 'fd-nit-wm', name: 'Wealth & Asset Allocation Consulting', sbu: 'non-IT' },
  { id: 'fd-nit-ops', name: 'Transaction Processing & Settlement Operations', sbu: 'non-IT' },
  { id: 'fd-nit-cs', name: 'Premium Client Services & Contact Center Management', sbu: 'non-IT' },
  { id: 'fd-nit-hr', name: 'Organizational Development & Talent Management', sbu: 'non-IT' }
];

// Function Specialty Options filtered by Functional Domain ID
export const FUNCTION_SPECIALTIES: FunctionSpecialtyOption[] = [
  // Front-End (fd-it-fe)
  { id: 'fs-fe-1', name: 'React SPA Engineering & State Performance', domainId: 'fd-it-fe' },
  { id: 'fs-fe-2', name: 'Mobile Web Development & Responsive Engines', domainId: 'fd-it-fe' },
  { id: 'fs-fe-3', name: 'Design System Implementation & Interactive Prototyping', domainId: 'fd-it-fe' },
  
  // Back-End (fd-it-be)
  { id: 'fs-be-1', name: 'High-Frequency Core Trading APIs (Java/C++)', domainId: 'fd-it-be' },
  { id: 'fs-be-2', name: 'Distributed Microservice Architecture (NodeJS/Golang)', domainId: 'fd-it-be' },
  { id: 'fs-be-3', name: 'Database Optimization & Distributed Caching Engines', domainId: 'fd-it-be' },

  // Big Data (fd-it-de)
  { id: 'fs-de-1', name: 'Apache Spark Datasets & ETL Data Pipeline Design', domainId: 'fd-it-de' },
  { id: 'fs-de-2', name: 'Data Warehousing, Redshift & BigQuery Operations', domainId: 'fd-it-de' },
  { id: 'fs-de-3', name: 'Real-Time Streaming Systems with Kafka Streams', domainId: 'fd-it-de' },

  // QA (fd-it-qa)
  { id: 'fs-qa-1', name: 'Test Automation Development (Playwright / Cypress)', domainId: 'fd-it-qa' },
  { id: 'fs-qa-2', name: 'Load & Performance Benchmark Testing (JMeter)', domainId: 'fd-it-qa' },
  { id: 'fs-qa-3', name: 'Manual Exploratory Testing & High-Risk Case Validation', domainId: 'fd-it-qa' },

  // Security (fd-it-sec)
  { id: 'fs-sec-1', name: 'Penetration Testing & Web Application Vulnerabilities', domainId: 'fd-it-sec' },
  { id: 'fs-sec-2', name: 'SecOps - Security Information & Event Management (SIEM)', domainId: 'fd-it-sec' },
  { id: 'fs-sec-3', name: 'Cryptographic Architecture & Token Validation', domainId: 'fd-it-sec' },

  // Wealth Management (fd-nit-wm)
  { id: 'fs-wm-1', name: 'Asset Portfolio Management & Advisory (Equity Focus)', domainId: 'fd-nit-wm' },
  { id: 'fs-wm-2', name: 'Bonds, Structured Products & Alternative Investments Advisory', domainId: 'fd-nit-wm' },
  { id: 'fs-wm-3', name: 'Financial Planning & Tax Optimization Strategies', domainId: 'fd-nit-wm' },

  // Operations (fd-nit-ops)
  { id: 'fs-ops-1', name: 'Securities Clearing, Settlement & Depository Processing', domainId: 'fd-nit-ops' },
  { id: 'fs-ops-2', name: 'Internal Audit & Reconciliation Optimization Support', domainId: 'fd-nit-ops' },

  // Client Services (fd-nit-cs)
  { id: 'fs-cs-1', name: 'High-Net-Worth Relationship Management & Retention', domainId: 'fd-nit-cs' },
  { id: 'fs-cs-2', name: 'Omnichannel Customer Support & Quality Monitoring', domainId: 'fd-nit-cs' },

  // Human Resources (fd-nit-hr)
  { id: 'fs-hr-1', name: 'Technical & Leadership Talent Acquisition', domainId: 'fd-nit-hr' },
  { id: 'fs-hr-2', name: 'KPI Design, Performance Appraisal & Compensation Planning', domainId: 'fd-nit-hr' },
  { id: 'fs-hr-3', name: 'L&D Curriculum Design & Digital Workplace Training', domainId: 'fd-nit-hr' }
];

// Human-readable names for selected Career Track, Functional Domain & Specialties
export function getOptionName(id: string, type: 'CT' | 'FD' | 'FS'): string {
  if (type === 'CT') {
    return CAREER_TRACKS.find(o => o.id === id)?.name || id;
  } else if (type === 'FD') {
    return FUNCTIONAL_DOMAINS.find(o => o.id === id)?.name || id;
  } else {
    return FUNCTION_SPECIALTIES.find(o => o.id === id)?.name || id;
  }
}
