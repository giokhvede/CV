import { template1, template2 } from "../components/designs";

export const adminIds = ["105923647780771981548"];

export const initialTags = [
  "Basic",
  "Creative",
  "Minimalist",
  "Traditional",
  "Modern",
  "Tech",
  "Simple",
  "Skill-Based",
  "Professional",
];

export const FiltersData = [
  { id: "1", label: "Basic", value: "basic" },
  { id: "2", label: "Creative", value: "creative" },
  { id: "3", label: "Minimalist", value: "minimalist" },
  { id: "4", label: "Traditional", value: "traditional" },
  { id: "5", label: "Modern", value: "modern" },
  { id: "6", label: "Tech", value: "Tech" },
  { id: "7", label: "Simple", value: "simple" },
  { id: "8", label: "Skill-Based", value: "skill-based" },
  { id: "9", label: "Professional", value: "professional" },
];

export const templatesData = [
  { id: `template-${Date.now()}`, name: "template1", component: template1 },
  { id: `template-${Date.now()}`, name: "template2", component: template2 },
];
