export interface Author {
  id: string;
  name: string;
  initials: string;
  color: string;
  textColor?: string;
}

export type PostType = "comida" | "siesta" | "actividad" | "logro" | "animo" | "foto" | "anuncio";

export const POST_TYPE_CONFIG: Record<PostType, { label: string; bg: string; text: string }> = {
  comida: { label: "Comida", bg: "#9A7B1E", text: "#fff" },
  siesta: { label: "Siesta", bg: "#E7DCF6", text: "#7B5FC0" },
  actividad: { label: "Actividad", bg: "#2E89A6", text: "#fff" },
  logro: { label: "Logro", bg: "#CFEBD8", text: "#3E9B6C" },
  animo: { label: "Ánimo", bg: "#F9D2DE", text: "#C56486" },
  foto: { label: "Foto", bg: "#FBD8CC", text: "#D9684A" },
  anuncio: { label: "Anuncio", bg: "#CCD8F4", text: "#4E72C8" },
};

export interface PostFormData {
  childId: string;
  type: PostType;
  description: string;
  photos: File[];
}

export interface Post {
  id: string;
  type: PostType;
  author: Author;
  timestamp: string;
  publishedBy: string;
  target: string;
  content: string;
  imageUrl?: string;
  imageCaption?: string;
  likes: number;
  comments: number;
}

export interface User {
  id: string;
  name: string;
  role: string;
  room: string;
  initials: string;
}

export const currentUser: User = {
  id: "user-1",
  name: "Caro Giménez",
  role: "Maestra",
  room: "Sala Soles",
  initials: "C",
};

const mateo: Author = {
  id: "kid-1",
  name: "Mateo",
  initials: "M",
  color: "#A9D9E8",
  textColor: "#1F7A93",
};

const daycare: Author = {
  id: "org-1",
  name: "Anuncio general",
  initials: "",
  color: "#CCD8F4",
};

export const posts: Post[] = [
  {
    id: "post-1",
    type: "logro",
    author: mateo,
    timestamp: "14:20",
    publishedBy: "vos",
    target: "familia de Mateo",
    content:
      "¡Usó el orinal solito por primera vez! Estaba feliz de contárselo a todos. Un gran paso.",
    likes: 3,
    comments: 1,
  },
  {
    id: "post-2",
    type: "actividad",
    author: mateo,
    timestamp: "09:40",
    publishedBy: "vos",
    target: "familia de Mateo",
    content:
      "Pintamos con témperas esta mañana. Mateo eligió el azul para todo y se concentró un montón mezclando colores.",
    imageCaption: "Foto · pintando con témperas",
    likes: 5,
    comments: 2,
  },
  {
    id: "post-3",
    type: "anuncio",
    author: daycare,
    timestamp: "07:50",
    publishedBy: "vos",
    target: "toda la sala",
    content:
      "El viernes salimos al parque por la mañana. Recuerden mandar gorra y una botellita de agua.",
    likes: 8,
    comments: 0,
  },
];
