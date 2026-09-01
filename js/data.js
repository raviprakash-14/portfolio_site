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
      id: 'growplus',
      name: 'GrowPlus',
      role: 'Co-founder',
      category: 'Startup / Growth Platform',
      status: 'Live',
      icon: 'GP',
      description:
        'My startup, co-founded to build an intelligent growth solutions platform that helps businesses scale through data-driven strategies, automation pipelines and AI-powered tooling.',
      tech: ['JavaScript', 'Automation', 'Growth Engineering', 'Full-Stack'],
      image: null,
      liveUrl: 'https://growplus.site',
      githubUrl: null
    },
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
      id: 'vr-furniture',
      name: 'VR Integrated Furniture E-Commerce Platform',
      role: 'Builder & Developer',
      category: 'VR / AR / Mobile Commerce',
      status: 'Project',
      icon: 'VR',
      description:
        'A furniture shopping application with an augmented reality view, letting a shopper place and preview a product in their own space before buying. Covers browsing, cart, checkout and an admin side.',
      tech: ['React Native', 'Expo', 'AR', 'Firebase', 'Supabase'],
      image: null,
      liveUrl: null,
      githubUrl: null
    },
    {
      id: 'agrihire',
      name: 'AgriHire Chatbot',
      role: 'Builder & Developer',
      category: 'AI / Chatbot / AgriTech',
      status: 'Built',
      icon: 'AG',
      description:
        'A WhatsApp-based chatbot connecting farmers with agricultural workers - featuring intelligent worker matching, number masking for privacy, and automated hiring workflows. Built at a hackathon, where it won an award.',
      tech: ['WhatsApp API', 'Node.js', 'MongoDB', 'Dialogflow'],
      image: null,
      liveUrl: null,
      githubUrl: null     /* paste the repository URL here when ready */
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
  ]
};
