export interface Author {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export type PostType = "logro" | "actividad" | "anuncio";

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
