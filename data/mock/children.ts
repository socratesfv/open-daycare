export interface Parent {
  id: string;
  name: string;
  initials: string;
  color: string;
  role: "Mamá" | "Papá";
  status: "active" | "pending";
}

export interface Child {
  id: string;
  name: string;
  initials: string;
  color: string;
  age: number;
  room: string;
  admissionDate: string;
  birthDate: string;
  allergies?: string;
  parents: Parent[];
}

export const children: Child[] = [
  {
    id: "kid-1",
    name: "Mateo Fernández",
    initials: "M",
    color: "A9D9E8",
    age: 3,
    room: "Soles",
    admissionDate: "feb 2025",
    birthDate: "12 mar 2022",
    allergies: "Maní: alergia al maní. Evitar frutos secos. Lleva inhalador en la mochila.",
    parents: [
      { id: "parent-1", name: "Lucía Fernández", initials: "L", color: "C9B6E8", role: "Mamá", status: "active" },
      { id: "parent-2", name: "Diego Fernández", initials: "D", color: "A9C7E8", role: "Papá", status: "pending" },
    ],
  },
  {
    id: "kid-2",
    name: "Sofía Méndez",
    initials: "S",
    color: "F4B8CC",
    age: 2,
    room: "Soles",
    admissionDate: "mar 2025",
    birthDate: "15 jul 2023",
    parents: [
      { id: "parent-3", name: "Carolina Méndez", initials: "C", color: "F4B8CC", role: "Mamá", status: "active" },
    ],
  },
  {
    id: "kid-3",
    name: "Benjamín Ruiz",
    initials: "B",
    color: "B9DEC4",
    age: 3,
    room: "Soles",
    admissionDate: "ene 2024",
    birthDate: "08 nov 2022",
    parents: [
      { id: "parent-4", name: "Julia Ruiz", initials: "J", color: "C9B6E8", role: "Mamá", status: "active" },
      { id: "parent-5", name: "Martín Ruiz", initials: "M", color: "A9C7E8", role: "Papá", status: "active" },
    ],
  },
  {
    id: "kid-4",
    name: "Valentina Soto",
    initials: "V",
    color: "F4DC8E",
    age: 2,
    room: "Soles",
    admissionDate: "ago 2024",
    birthDate: "21 ene 2023",
    parents: [],
  },
  {
    id: "kid-5",
    name: "Tomás Díaz",
    initials: "T",
    color: "C9B6E8",
    age: 3,
    room: "Soles",
    admissionDate: "may 2024",
    birthDate: "03 sep 2022",
    allergies: "Lactosa: intolerancia a la lactosa. Evitar lácteos.",
    parents: [
      { id: "parent-6", name: "Ana Díaz", initials: "A", color: "F4B8CC", role: "Mamá", status: "active" },
    ],
  },
  {
    id: "kid-6",
    name: "Emma Castro",
    initials: "E",
    color: "F4B8CC",
    age: 2,
    room: "Soles",
    admissionDate: "oct 2024",
    birthDate: "28 abr 2023",
    parents: [
      { id: "parent-7", name: "Laura Castro", initials: "L", color: "B9DEC4", role: "Mamá", status: "active" },
    ],
  },
  {
    id: "kid-7",
    name: "Lucas Romero",
    initials: "L",
    color: "A9D9E8",
    age: 3,
    room: "Soles",
    admissionDate: "feb 2024",
    birthDate: "17 jun 2022",
    parents: [
      { id: "parent-8", name: "Pablo Romero", initials: "P", color: "C9B6E8", role: "Papá", status: "active" },
    ],
  },
  {
    id: "kid-8",
    name: "Olivia Vega",
    initials: "O",
    color: "B9DEC4",
    age: 2,
    room: "Soles",
    admissionDate: "dic 2024",
    birthDate: "09 ene 2023",
    parents: [
      { id: "parent-9", name: "Florencia Vega", initials: "F", color: "F4DC8E", role: "Mamá", status: "active" },
    ],
  },
];
