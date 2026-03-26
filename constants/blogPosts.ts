import type { BlogImageKey } from '@/constants/appImages';

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readMinutes: number;
  /** Local bundled asset key — unique per post */
  imageKey: BlogImageKey;
  body: string;
  featured?: boolean;
  tags?: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Why “legal clarity” is a leadership skill',
    excerpt: 'The best operators treat legal questions as design constraints—not blockers.',
    date: '2025-02-12',
    readMinutes: 4,
    imageKey: 'blogLeadership',
    featured: true,
    tags: ['Leadership', 'Clarity', 'Strategy'],
    body: `Leaders who invite counsel early usually ship faster. When legal input arrives at the end of a project, everything becomes expensive rework.

We recommend a simple rhythm: name the decision, list assumptions, and ask what could make this fragile. That single habit prevents most surprises.

At Bottin Creek, we write for busy executives—short memos, explicit trade-offs, and next steps you can act on Monday morning.`,
  },
  {
    id: '2',
    title: 'Documentation that teams actually use',
    excerpt: 'If nobody can find it, it does not exist.',
    date: '2025-01-28',
    readMinutes: 3,
    imageKey: 'blogDocumentation',
    featured: true,
    tags: ['Documentation', 'Operations'],
    body: `Templates are not the goal—behavior is. We help clients keep a single source of truth: who owns updates, where files live, and how approvals flow.

Good documentation reduces anxiety. It is also the quiet backbone of compliance when regulators or partners ask questions.

Start with one critical path—sales, hiring, or vendor onboarding—and make it embarrassingly clear.`,
  },
  {
    id: '3',
    title: 'Disputes: the first 48 hours',
    excerpt: 'Cool heads and a tight timeline beat improvised responses.',
    date: '2025-01-09',
    readMinutes: 5,
    imageKey: 'blogDisputes',
    tags: ['Risk', 'Disputes'],
    body: `Most damage happens in the opening window—quick emails, partial facts, and emotional positioning.

We coach clients to pause, preserve records, and align on a one-page statement of facts. Then we choose a lane: negotiate, mediate, or prepare for escalation.

Speed matters, but direction matters more. A deliberate first 48 hours often determines whether a conflict stays contained.`,
  },
];
