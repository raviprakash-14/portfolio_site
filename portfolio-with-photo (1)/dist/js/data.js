/* =============================================================
   PORTFOLIO CONTENT
   -------------------------------------------------------------
   All of the site's written content lives here so it can be
   edited without touching markup or styles. Adding a project is
   a matter of copying one object in the `projects` array.

   Project fields
     id          unique slug, used for the DOM id
     name        display name
     role        your role on the project
     category    short label shown above the title
     status      'Live' | 'Built' | 'Project' | 'Ongoing'
     icon        emoji used as the card glyph
     description 1-2 sentences, factual
     tech        array of technology tags
     image       path to a card image, or null for the gradient
     liveUrl     public URL, or null to hide the Live Demo button
     githubUrl   repo URL, or null to hide the GitHub button

   Buttons only render when the matching URL is a real string, so
   leaving a field as null simply hides that button.
   ============================================================= */

window.PORTFOLIO_DATA = {

  projects: [
    {
      id: 'scrapify',
      name: 'Scrapify',
      role: 'Builder & Developer',
      category: 'AI / Computer Vision / Web App',
      status: 'Built',
      icon: 'RE',
      description:
        'A web application for scrap and waste analysis. A user uploads an image of a material, the app analyses that image, identifies the scrap, and presents the result back to the user.',
      tech: ['Web App', 'Computer Vision', 'Image Analysis', 'AI'],
      image: null,
      liveUrl: 'https://scrapifyy.netlify.app/',
      githubUrl: null     /* paste the repository URL here when ready */
    },
    {
      id: 'ornalens',
      name: 'Ornalens',
      role: 'Co-founder',
      category: 'Startup / AI Product',
      status: 'Live',
      icon: 'OR',
      description:
        'An AI-powered jewellery photography platform built to help jewellers produce product visuals without a physical studio shoot.',
      tech: ['AI', 'Computer Vision', 'Product', 'Startup'],
      image: null,
      liveUrl: 'https://ornalens.in',
      githubUrl: null
    },
    {
      id: 'ar-furniture',
      name: 'AR Furniture E-Commerce',
      role: 'Builder & Developer',
      category: 'AR / Mobile Commerce',
      status: 'Project',
      icon: 'AR',
      description:
        'A furniture shopping application with an augmented reality view, letting a shopper place and preview a product in their own space before buying. Covers browsing, cart, checkout and an admin side.',
      tech: ['React Native', 'Expo', 'AR', 'Firebase', 'Supabase'],
      image: null,
      liveUrl: null,
      githubUrl: null
    },
    {
      id: 'vr-experience',
      name: 'VR Experience Builder',
      role: 'Builder',
      category: 'VR / Spatial Computing',
      status: 'Project',
      icon: 'VR',
      description:
        'Immersive virtual reality environments and interactive scenes, exploring spatial computing and how interfaces behave once they leave the flat screen.',
      tech: ['VR', 'WebGL', 'Three.js', 'Spatial UI'],
      image: null,
      liveUrl: null,
      githubUrl: null
    },
    {
      id: 'automation-suite',
      name: 'Automation Suite',
      role: 'Builder',
      category: 'Automation / AI Agents',
      status: 'Project',
      icon: 'AU',
      description:
        'Workflow automation tooling that removes repetitive manual steps, wiring AI agents and APIs into everyday processes.',
      tech: ['Automation', 'AI Agents', 'APIs', 'Workflows'],
      image: null,
      liveUrl: null,
      githubUrl: null
    },
    {
      id: 'brand-identity',
      name: 'Brand Identity System',
      role: 'Designer & Builder',
      category: 'Branding / UI-UX',
      status: 'Project',
      icon: 'BR',
      description:
        'End-to-end brand and design system work for technology products - visual language, typography, motion, and the digital touchpoints built on top of them.',
      tech: ['Branding', 'UI/UX', 'Design Systems'],
      image: null,
      liveUrl: null,
      githubUrl: null
    },
    {
      id: 'creative-tech-lab',
      name: 'Creative Tech Lab',
      role: 'Builder',
      category: 'Creative Technology',
      status: 'Ongoing',
      icon: 'CT',
      description:
        'An ongoing set of experiments where art meets code - generative visuals, interactive pieces and AI-assisted creative tools.',
      tech: ['Generative AI', 'Creative Code', 'WebGL'],
      image: null,
      liveUrl: null,
      githubUrl: null
    }
  ],

  /* Skill areas rendered as an interactive constellation. These are
     areas of interest and practice - deliberately not scored, since
     a self-assigned percentage would not mean anything. */
  skills: [
    { name: 'AI Tools',          group: 'ai' },
    { name: 'AI Applications',   group: 'ai' },
    { name: 'Automation',        group: 'build' },
    { name: 'Frontend Dev',      group: 'build' },
    { name: 'UI / UX',           group: 'design' },
    { name: 'Software Products', group: 'build' },
    { name: 'AR / VR',           group: 'immersive' },
    { name: 'Creative Tech',     group: 'design' },
    { name: 'Product Building',  group: 'startup' },
    { name: 'Branding',          group: 'design' },
    { name: 'Startups',          group: 'startup' },
    { name: 'Experimentation',   group: 'ai' }
  ],

  /* Timeline. Years carried over from the previous version of the
     site - edit freely, nothing here is generated. */
  journey: [
    {
      year: '2019 - 2023',
      title: 'Engineering Foundation',
      description:
        'Built a technical base through engineering studies - programming, computer science fundamentals, and the maths underneath modern software.',
      active: false
    },
    {
      year: '2022',
      title: 'First Steps in AI & Automation',
      description:
        'Started exploring AI tools and automation, and building personal projects that combined engineering with creative problem solving.',
      active: false
    },
    {
      year: '2023',
      title: 'Ornalens - Co-founded',
      description:
        'Co-founded Ornalens, an AI-powered jewellery photography product, and began working on it alongside the team.',
      active: true
    },
    {
      year: '2024',
      title: 'Building & Iterating',
      description:
        'Focused on product development - building, testing and refining the product, while continuing to ship personal projects on the side.',
      active: true
    },
    {
      year: '2025 - Present',
      title: 'Building Across AI, Web & Immersive Tech',
      description:
        'Working on Scrapify, AR/VR experiments and automation tooling, while continuing as a co-founder at Ornalens.',
      active: true
    }
  ]
};
