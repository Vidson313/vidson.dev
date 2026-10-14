import { Project, SkillCategory, ExperienceItem } from '../types';

export const HERO_TYPING_PHRASES = [
  'full-stack products',
  'high-scale distributed backends',
  'high-conversion web apps',
  'resilient cloud architectures',
];

export const TRUST_METRICS = [
  { value: '10+', label: 'Years Experience', subtext: 'Production systems' },
  { value: '45+', label: 'Shipped Deployments', subtext: 'Zero critical downtime' },
  { value: '99.99%', label: 'P99 SLA Guarantee', subtext: 'Sub-120ms latency' },
  { value: '$140M+', label: 'Client Value Created', subtext: 'Across venture-backed SaaS' },
];

export const PROJECTS: Project[] = [
  {
    id: 'krypton-cloud',
    title: 'Krypton Engine',
    category: 'DISTRIBUTED SYSTEMS // CLOUD',
    subtitle: 'High-throughput event streaming & real-time telemetry processing 1.4B events/day',
    summary: 'A sub-millisecond telemetry ingestion pipeline and observability console designed to replace expensive Datadog clusters for high-frequency cloud microservices.',
    image: 'krypton',
    badge: 'Enterprise Production',
    techStack: ['Rust', 'TypeScript', 'Next.js 15', 'ClickHouse', 'Apache Kafka', 'Tailwind CSS', 'Docker'],
    metrics: [
      { label: 'Ingestion Throughput', value: '1.4B / day' },
      { label: 'Query P95 Latency', value: '< 42ms' },
      { label: 'Cloud Cost Reduction', value: '-68%' },
      { label: 'Concurrent WebSockets', value: '250k+' },
    ],
    problem: 'The client was experiencing 4.2-second query lag and unsustainable infrastructure fees while aggregating gigabytes of structured telemetry from 1,200 microservice pods.',
    solution: 'Engineered a dual-tier architecture: high-performance Rust ingestion gateway buffering into Kafka, partitioned by tenant key into ClickHouse columnar storage with an interactive React dashboard.',
    architecture: [
      'Zero-copy binary event deserializer in Rust',
      'Distributed Kafka cluster with snappy compression',
      'ClickHouse columnar aggregation with materialized views',
      'Real-time streaming UI using WebSocket multiplexing and React Server Components',
    ],
    codeSnippet: `// High-concurrency zero-copy telemetry pipe
pub async fn ingest_event_stream(
    State(state): State<Arc<EngineState>>,
    Json(payload): Json<BatchEventPayload>,
) -> Result<StatusCode, IngestionError> {
    let partition = state.partitioner.route_by_tenant(&payload.tenant_id);
    state.kafka_producer
        .send_batch(&partition, &payload.events)
        .await
        .map(|_| StatusCode::ACCEPTED)
        .map_err(IngestionError::KafkaBufferFull)
}`,
    liveUrl: 'https://krypton.vidson.dev',
    githubUrl: 'https://github.com/vidson-dev/krypton-engine',
  },
  {
    id: 'sovereign-pay',
    title: 'Sovereign Pay',
    category: 'FINTECH // HIGH AVAILABILITY',
    subtitle: 'PCI-DSS Level 1 compliant multi-currency checkout & ledger microservice',
    summary: 'Global checkout infrastructure supporting 36 local payment methods with automatic currency routing, double-entry reconciliation ledger, and instant dispute resolution.',
    image: 'sovereign',
    badge: 'Fintech Scaleup',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Stripe API', 'TypeScript', 'Tailwind CSS'],
    metrics: [
      { label: 'Annual Volume Processed', value: '$84M+' },
      { label: 'Checkout Conversion', value: '+28.4%' },
      { label: 'Settlement Speed', value: 'Instant' },
      { label: 'Audit Security Score', value: '100% PCI' },
    ],
    problem: 'SaaS merchants struggled with 9.2% checkout abandonment due to rigid regional currency conversions and slow gateway fallback mechanisms.',
    solution: 'Designed an intelligent payment router that detects user geolocation and issuing bank affinities, dispatching transactions across optimal payment processors with sub-second checkout UI.',
    architecture: [
      'Immutable double-entry ledger enforced at PostgreSQL trigger level',
      'Idempotent transaction queue with distributed Redis locks',
      'Single-page headless checkout widget under 28KB bundle size',
      'Automated nightly reconciliation cron with audit trail exports',
    ],
    codeSnippet: `// Idempotent payment intent reconciliation
export async function executeIdempotentCharge(
  idempotencyKey: string,
  charge: PaymentChargeRequest
): Promise<TransactionReceipt> {
  const acquiredLock = await redis.set(\`lock:\${idempotencyKey}\`, '1', 'PX', 5000, 'NX');
  if (!acquiredLock) throw new ConflictError('Concurrent settlement in progress');

  return await db.transaction(async (trx) => {
    const existing = await trx('ledger').where({ idempotency_key: idempotencyKey }).first();
    if (existing) return existing;
    return await processGateways(charge, trx);
  });
}`,
    liveUrl: 'https://sovereign.vidson.dev',
    githubUrl: 'https://github.com/vidson-dev/sovereign-pay',
  },
  {
    id: 'aura-clinical-ai',
    title: 'Aura Clinical AI',
    category: 'AI // HEALTHCARE',
    subtitle: 'HIPAA-grade ambient medical documentation & physician triage copilot',
    summary: 'Real-time audio transcription and clinical summarization tool converting 20-minute patient consults into formatted SOAP notes in under 4 seconds.',
    image: 'aura',
    badge: 'HealthTech Innovation',
    techStack: ['Python', 'FastAPI', 'TypeScript', 'WebRTC', 'React 19', 'Tailwind CSS', 'Docker'],
    metrics: [
      { label: 'Physician Time Saved', value: '2.8 hrs/day' },
      { label: 'Medical Term Accuracy', value: '98.7%' },
      { label: 'Note Generation Latency', value: '3.8s' },
      { label: 'Clinical Clinics Live', value: '18 Sites' },
    ],
    problem: 'Emergency room and primary care physicians were spending 40% of their day typing clinical notes into clunky EHR systems, causing severe physician burnout.',
    solution: 'Built a privacy-first ambient recording companion with client-side audio chunking, encrypted WebRTC streaming, and LLM extraction tailored to HL7 and FHIR medical standards.',
    architecture: [
      'Zero-retention client audio stream with in-memory tokenization',
      'Few-shot prompt pipeline producing structured ICD-10 and CPT codes',
      'Instant markdown EHR export with one-click doctor sign-off',
      'SOC2 Type II & HIPAA end-to-end encryption compliance',
    ],
    codeSnippet: `// Ambient consult audio buffer streaming
export const useAudioTranscriptionStream = (sessionId: string) => {
  const [transcription, setTranscription] = useState<string>('');
  
  const handleChunk = useCallback(async (audioChunk: Blob) => {
    const pcmData = await convertToLinear16PCM(audioChunk);
    rtcDataChannel.send(pcmData);
  }, [sessionId]);

  return { transcription, handleChunk };
};`,
    liveUrl: 'https://aura.vidson.dev',
    githubUrl: 'https://github.com/vidson-dev/aura-clinical',
  },
  {
    id: 'nexus-design-tokens',
    title: 'Nexus Token Core',
    category: 'FRONTEND // DEVELOPER TOOLING',
    subtitle: 'Multi-brand design token compiler & atomic component system for 12 squads',
    summary: 'A high-performance build-time design token compiler that harmonizes Web, iOS, and Android design systems into a unified zero-runtime CSS utility pipeline.',
    image: 'nexus',
    badge: 'Open Source & Enterprise',
    techStack: ['TypeScript', 'Vite', 'React', 'Storybook', 'Tailwind CSS', 'NPM Package'],
    metrics: [
      { label: 'Engineering Squads', value: '12 Teams' },
      { label: 'Component Bundle Size', value: '< 12KB' },
      { label: 'Release Regression Rate', value: '0.0%' },
      { label: 'Theme Switch Latency', value: '0ms' },
    ],
    problem: 'A distributed engineering team with 80+ developers was repeating CSS code across 4 frontend repos, leading to branding inconsistencies and slow feature velocity.',
    solution: 'Constructed an automated token pipeline using Style Dictionary and typed CSS variables, complemented by 45 accessible, keyboard-first React primitives.',
    architecture: [
      'Figma Token API webhook synchronizing brand primitives instantly',
      'Automated visual regression testing using Playwright in CI/CD',
      'WCAG 2.1 AAA automated contrast calculation engine',
      'Tree-shakeable ESM module bundle distributed via private registry',
    ],
    codeSnippet: `// Dynamic design token parser with strict typing
export function compileThemeVariables<T extends TokenDefinition>(tokens: T): string {
  return Object.entries(tokens)
    .map(([key, value]) => \`--color-\${kebabCase(key)}: \${validateHexContrast(value)};\`)
    .join('\\n');
}`,
    liveUrl: 'https://nexus.vidson.dev',
    githubUrl: 'https://github.com/vidson-dev/nexus-tokens',
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Frontend Architecture',
    iconName: 'Layout',
    skills: [
      { name: 'React 19 & Next.js', level: 98, experience: '8+ yrs', focus: 'RSC, Server Actions, App Router' },
      { name: 'TypeScript', level: 96, experience: '7+ yrs', focus: 'Type-level generics, strict safety' },
      { name: 'Tailwind CSS & Design Systems', level: 95, experience: '6+ yrs', focus: 'Atomic UI, token pipelines' },
      { name: 'State Machines & Performance', level: 92, experience: '5+ yrs', focus: 'XState, Zustand, sub-60fps rendering' },
    ],
  },
  {
    title: 'Backend & Distributed Systems',
    iconName: 'Server',
    skills: [
      { name: 'Node.js & Express / NestJS', level: 95, experience: '9+ yrs', focus: 'Microservices, Event-driven architecture' },
      { name: 'Rust & Go Microservices', level: 86, experience: '4+ yrs', focus: 'High-throughput networking, low latency' },
      { name: 'REST & GraphQL APIs', level: 94, experience: '8+ yrs', focus: 'Contract-first API design, OpenAPI' },
      { name: 'Event Streaming (Kafka / RabbitMQ)', level: 88, experience: '5+ yrs', focus: 'Pub/Sub queues, distributed logs' },
    ],
  },
  {
    title: 'Cloud & Database Infrastructure',
    iconName: 'Database',
    skills: [
      { name: 'PostgreSQL & ClickHouse', level: 92, experience: '7+ yrs', focus: 'Query optimization, indexing, analytics' },
      { name: 'Redis Caching & Distributed Locks', level: 94, experience: '6+ yrs', focus: 'Session storage, rate limiting, pub/sub' },
      { name: 'Docker, K8s & CI/CD', level: 89, experience: '6+ yrs', focus: 'Containerization, GitHub Actions, Terraform' },
      { name: 'AWS & Cloudflare Edge', level: 90, experience: '5+ yrs', focus: 'Serverless, S3, ECS, Edge Workers' },
    ],
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    period: '2022 — Present',
    role: 'Staff Full-Stack Architect',
    company: 'HyperScale Cloud Labs',
    location: 'Remote // San Francisco, CA',
    description: 'Lead technical architect directing frontend core and distributed cloud microservices for enterprise SaaS products reaching 3M+ monthly active users.',
    achievements: [
      'Spearheaded migration from monolithic Rails to modular Next.js + Go microservices, reducing AWS compute overhead by 46%.',
      'Mentored 14 senior engineers across distributed systems and design system engineering.',
      'Maintained 99.99% availability during multi-region failover tests.',
    ],
    technologies: ['TypeScript', 'Next.js', 'Go', 'Kafka', 'PostgreSQL', 'Docker'],
  },
  {
    period: '2019 — 2022',
    role: 'Senior Full-Stack Developer',
    company: 'Vanguard FinTech Solutions',
    location: 'New York, NY',
    description: 'Designed and deployed compliant payment checkout engines, high-frequency merchant reconciliation tools, and real-time fraud monitoring portals.',
    achievements: [
      'Built automated settlement ledger processing $12M+ weekly volume with sub-second audit verification.',
      'Reduced checkout abandonment by 18% via dynamic localized payment method integrations.',
    ],
    technologies: ['React', 'Node.js', 'Stripe API', 'Redis', 'PostgreSQL', 'Tailwind CSS'],
  },
  {
    period: '2016 — 2019',
    role: 'Lead Front-End Engineer',
    company: 'Studio Kinetic Digital',
    location: 'Berlin, Germany',
    description: 'Crafted award-winning digital experiences, interactive web applications, and web design systems for high-growth tech brands.',
    achievements: [
      'Won 3 Awwwards Site of the Day and FWA recognitions for interactive web engineering.',
      'Pioneered internal performance audit tool that achieved 98+ Lighthouse scores on all client releases.',
    ],
    technologies: ['JavaScript ES6+', 'React', 'WebGL / Three.js', 'CSS Architecture', 'Node.js'],
  },
];

export const ABOUT_TEXT = {
  headline: "Bridging architectural rigor with pixel-perfect frontend finesse.",
  paragraphs: [
    "I am a Senior Web Designer & Full-Stack Architect with over a decade of production experience. I don't just write code — I build software products that scale gracefully under load, convert users into paying customers, and deliver unmistakable craft in every interaction.",
    "My philosophy is rooted in dev-first clarity: zero unneeded bloat, ruthless type safety, sub-100ms P99 latency, and obsessive typography. Whether bootstrapping an MVP from 0 to 1 or hardening distributed infrastructure for millions of events, I deliver senior ownership from day one.",
  ],
  status: "Available for Q3/Q4 contracts & select advising roles",
  location: "San Francisco, CA (UTC-7) / Remote Worldwide",
  email: "mohamadaminseraji1@gmail.com",
  secondaryEmail: "hello@vidson.dev",
  website: "https://aminseraj.eu.cc/",
  telegram: "https://t.me/MHMD_DEVVV",
  github: "https://github.com/Vidson313",
};
