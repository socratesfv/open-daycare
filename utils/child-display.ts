const AVATAR_COLORS = ["A9D9E8", "F4B8CC", "B9DEC4", "F4DC8E", "C9B6E8", "A9C7E8"];

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(`${birthDate}T00:00:00`);
  if (isNaN(birth.getTime())) return 0;
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return Math.max(age, 0);
}

export function formatDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  if (isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}

const ALLERGY_LABELS: Record<string, string> = {
  peanut: "Maní",
  lactose: "Lactosa",
  gluten: "Gluten",
  egg: "Huevo",
  soy: "Soja",
  fish: "Pescado",
  shellfish: "Mariscos",
  tree_nuts: "Frutos secos",
  dairy: "Lácteos",
};

export function translateAllergy(tag: string): string {
  return ALLERGY_LABELS[tag] ?? tag;
}

const ALLERGY_TO_ENGLISH: Record<string, string> = {
  maní: "peanut",
  mani: "peanut",
  lactosa: "lactose",
  gluten: "gluten",
  huevo: "egg",
  soja: "soy",
  pescado: "fish",
  mariscos: "shellfish",
  "frutos secos": "tree_nuts",
  lácteos: "dairy",
  lacteos: "dairy",
};

export function toAllergyTag(label: string): string {
  const normalized = label.trim().toLowerCase();
  return ALLERGY_TO_ENGLISH[normalized] ?? normalized;
}

export function parseAllergyTags(input: string): string[] {
  return input
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map(toAllergyTag);
}
