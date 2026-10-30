import { JournalArticle } from '../types';

export const journalArticles: JournalArticle[] = [
  {
    id: 'microservice-failure-detection-baseline',
    title: 'Impact of Monitoring Baselines on Microservice Failure Detection',
    category: 'Undergraduate Research',
    date: 'Ongoing (2026)',
    readTime: 'Research Project',
    abstract: 'Investigating how different sources of normal monitoring data influence microservice failure detection using infrastructure metrics, service response signals, and their combination. Conducted at the University of Jaffna, Department of Computer Science under the supervision of Dr. (Ms.) J. Samantha Tharani.',
    tags: ['Microservices', 'Monitoring', 'Anomaly Detection', 'Cloud Reliability', 'RCAEval', 'Isolation Forest'],
    highlights: [
      'Institution: University of Jaffna, Department of Computer Science (Supervisor: Dr. (Ms.) J. Samantha Tharani).',
      'Investigates whether models trained on different normal operating periods produce different detection results.',
      'Compares three normal-baseline conditions: Same-run baseline, Other-run baseline, and Pooled-run baseline.',
      'Evaluates three monitoring configurations: Infrastructure metrics, Service response signals, and Combined monitoring signals.',
      'Planned empirical evaluation uses the public RCAEval benchmark (735 fault injection cases across Online Boutique, Sock Shop, Train Ticket) with Isolation Forest.',
      'Examines how baseline selection influences failure detection, false alarms, and consistency across diverse applications and fault types.'
    ],
    link: 'https://github.com/PamudaUposath'
  },
  {
    id: 'aws-new-voices-journey',
    title: 'From Practice to the Stage: My AWS New Voices 2026 Journey',
    category: 'Cloud Architecture',
    date: 'September 2026',
    readTime: '6 min read',
    abstract: 'A reflective account of participating in the AWS New Voices 2026 speaker development initiative, developing cloud technical communication skills, and delivering technical talks to community audiences.',
    tags: ['AWS Community', 'Technical Speaking', 'Cloud Fluency', 'AWS New Voices', 'Community Leadership'],
    highlights: [
      'Mastered technical presentation techniques and audience engagement methodologies.',
      'Delivered lightning talks on AWS cloud-native architecture principles.',
      'Shared practical insights on building student cloud builder communities.',
      'Published on the official AWS Builder Center platform.'
    ],
    link: 'https://builder.aws.com/content/3JMn8wlkp2akhBOsrbsB4wFmDm1/from-practice-to-the-stage-my-aws-new-voices-2026-journey'
  },
  {
    id: 'pywhatkit-ieee-publication',
    title: 'PyWhatKit: Automate WhatsApp with Python',
    category: 'Technical Article',
    date: 'June 2025',
    readTime: '5 min read',
    abstract: 'Official technical article published in IEEENews@UoJ Annual Newsletter 2023 Vol. III (ISSN 2806-531X, page 25) examining headless automation patterns and Python utility scripting.',
    tags: ['Python', 'Automation', 'IEEE', 'Open Source', 'Scripting'],
    highlights: [
      'Published in IEEENews@UoJ Annual Newsletter Vol. III (ISSN 2806-531X).',
      'Architectural breakdown of PyWhatKit automation capabilities for messaging.',
      'Hands-on workflow recipes for scheduled alerts and automated notifications.',
      'Disseminated across university engineering and student developer communities.'
    ],
    link: 'https://www.linkedin.com/in/pamuda-uposath-goonatilake'
  },
  {
    id: 'kananiyam-tech-meetups',
    title: 'Tech Meetups in Sri Lanka: Building Developer Ecosystems',
    category: 'Industry Analysis',
    date: 'February 2025',
    readTime: '6 min read',
    abstract: 'Feature article published in Kananiyam 2025 Vol. 06 (Computer Society Magazine, UoJ) exploring the evolution of tech meetup culture and grassroots community building in Sri Lanka.',
    tags: ['Tech Community', 'Sri Lanka Tech', 'Developer Ecosystems', 'Kananiyam', 'CompSoc UoJ'],
    highlights: [
      'Published in Kananiyam 2025 celebrating 30 years of Computer Society UoJ.',
      'In-depth study of physical and hybrid developer meetups across Sri Lanka.',
      'Actionable strategies for student branches to connect with industry practitioners.',
      'Featured in both print (pages 38-39) and digital editions (pages 44-45).'
    ],
    link: 'https://www.linkedin.com/in/pamuda-uposath-goonatilake'
  }
];
