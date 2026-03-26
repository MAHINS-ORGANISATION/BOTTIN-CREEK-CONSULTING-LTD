import type { ServiceImageKey } from '@/constants/appImages';

export type ServiceCategory = 'Advisory' | 'Documentation' | 'Engagement';

export type CatalogItem = {
  id: string;
  title: string;
  category: ServiceCategory;
  summary: string;
  /** Local bundled asset key — unique per service */
  imageKey: ServiceImageKey;
  description: string;
  deliverables: string[];
  idealFor: string[];
  timeline: string;
  featured?: boolean;
  accent: string;
};

export const CATALOG: CatalogItem[] = [
  {
    id: 'corp-governance',
    title: 'Corporate governance review',
    category: 'Advisory',
    summary: 'Board structures, policies, and accountability frameworks tailored to your stage.',
    imageKey: 'serviceGovernance',
    description:
      'A structured review of governance posture, decision rights, and reporting hygiene. We translate legal obligations into a calm operating rhythm for leadership.',
    deliverables: ['Board-ready memo', 'Policy & charter checklist', 'Risk and disclosure map'],
    idealFor: ['Scaling leadership teams', 'Investors preparing for oversight', 'Boards needing clarity'],
    timeline: '2–3 weeks',
    featured: true,
    accent: '#2b59c3',
  },
  {
    id: 'compliance',
    title: 'Compliance roadmap',
    category: 'Advisory',
    summary: 'Practical mapping of regulatory touchpoints without overwhelming your team.',
    imageKey: 'serviceCompliance',
    description:
      'We map your obligations, owners, and deadlines into a single view. Expect a pragmatic plan that keeps regulators satisfied and teams aligned.',
    deliverables: ['Compliance matrix', 'Owner assignments', '90-day action roadmap'],
    idealFor: ['Regulated industries', 'New market launches', 'Operations teams'],
    timeline: '10–14 days',
    accent: '#1f8a70',
  },
  {
    id: 'contracts',
    title: 'Contract drafting & revision',
    category: 'Documentation',
    summary: 'Clear agreements that reflect how you actually work with clients and partners.',
    imageKey: 'serviceContracts',
    description:
      'We tighten language, reduce friction, and clarify obligations so your agreements support growth without slowing deals.',
    deliverables: ['Clean contract set', 'Fallback clause options', 'Playbook notes'],
    idealFor: ['B2B services', 'Partnership teams', 'Founders closing enterprise deals'],
    timeline: '5–7 business days',
    featured: true,
    accent: '#d96c8b',
  },
  {
    id: 'risk',
    title: 'Risk and dispute prevention',
    category: 'Advisory',
    summary: 'Early signal detection and playbooks before issues become costly.',
    imageKey: 'serviceRisk',
    description:
      'We help you see risk early and respond with discipline. The outcome is a repeatable response plan that keeps teams calm under pressure.',
    deliverables: ['Incident response checklist', 'Comms template', 'Escalation paths'],
    idealFor: ['Customer support leaders', 'Ops teams', 'Legal + comms'],
    timeline: '7–10 days',
    accent: '#f6c453',
  },
  {
    id: 'retainer',
    title: 'Ongoing counsel engagement',
    category: 'Engagement',
    summary: 'Reserved capacity for questions, document review, and strategic check-ins.',
    imageKey: 'serviceRetainer',
    description:
      'A premium, on-call relationship for fast answers, document review, and executive guidance on demand.',
    deliverables: ['Monthly check-in', 'Priority review', 'Decision memo support'],
    idealFor: ['Leadership teams', 'Operations leads', 'Boards'],
    timeline: 'Monthly',
    featured: true,
    accent: '#2b59c3',
  },
  {
    id: 'workshop',
    title: 'Executive legal literacy workshop',
    category: 'Engagement',
    summary: 'A focused session for leadership on obligations, optics, and decision hygiene.',
    imageKey: 'serviceWorkshop',
    description:
      'A tailored workshop designed to align leadership on risk, governance, and decision discipline.',
    deliverables: ['Workshop deck', 'Scenario exercises', 'Leadership action guide'],
    idealFor: ['Executive teams', 'Board retreats', 'Leadership offsites'],
    timeline: '1–2 weeks prep',
    accent: '#1f8a70',
  },
];
