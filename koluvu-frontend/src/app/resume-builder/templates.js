// src/app/resume-builder/templates.js

export const modernTemplates = [
  {
    id: "blue-white-clean",
    name: "Pathfinder",
    preview: "/pathfinder.jpg",
    description: "Professional blue and white design with clean layout",
    category: "Modern",
    rating: "4.9",
    pages: 1,
    bestFor: "Business professionals, managers",
    featured: true,
    new: true,
    component: "BlueWhiteCleanTemplate",
  },
  {
    id: "dark-green-gradient",
    name: "The Bridge",
    preview: "/bridge.jpg",
    description: "Colorful gradient design perfect for educators",
    category: "Modern",
    rating: "4.8",
    pages: 1,
    bestFor: "Teachers, educators, trainers",
    featured: true,
    new: true,
    component: "DarkGreenGradientTemplate",
  },
  {
    id: "white-gray-infographic",
    name: "Minimalist Modern",
    preview: "/modern.jpg",
    description: "Clean minimalist design with grey accents",
    category: "Modern",
    rating: "4.7",
    pages: 1,
    bestFor: "All professions, clean presentation",
    featured: true,
    new: true,
    component: "WhiteGrayInfographicTemplate",
  },
  // Removed: Turning Point (blue-creative) and Evolve (green-business-analyst)
];

export const classicTemplates = [
  {
    id: "dark-grey-professional",
    name: "Trailblazer",
    preview: "/trailblazer.jpg",
    description: "Professional dark grey and white layout",
    category: "Classic",
    rating: "4.7",
    pages: 1,
    bestFor: "Corporate professionals, executives",
    featured: true,
    new: true,
    component: "DarkGreyProfessionalTemplate",
  },
];

export const executiveTemplates = [
  {
    id: "black-white-elegant",
    name: "Milestone",
    preview: "/milestone.jpg",
    description:
      "Professional black and white design perfect for HR and recruiting",
    category: "Executive",
    rating: "4.9",
    pages: 1,
    bestFor: "HR professionals, recruiters, corporate roles",
    featured: true,
    new: true,
    component: "BlackWhiteElegantTemplate",
  },
];

export const fresherTemplates = [
  {
    id: "cream-fresh-graduate",
    name: "Navigator",
    preview: "/navigator.jpg",
    description: "Clean cream minimalist design perfect for fresh graduates",
    category: "Fresher",
    rating: "4.7",
    pages: 1,
    bestFor: "Fresh graduates, entry-level professionals",
    featured: true,
    new: true,
    component: "CreamFreshGraduateTemplate",
  },
];

// Export all templates combined
export const allTemplates = [
  ...modernTemplates,
  ...classicTemplates,
  ...executiveTemplates,
  ...fresherTemplates,
];
