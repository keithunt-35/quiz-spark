export const AVATARS = [
  { id: "fox", emoji: "🦊", label: "Fox" },
  { id: "cat", emoji: "🐱", label: "Cat" },
  { id: "panda", emoji: "🐼", label: "Panda" },
  { id: "unicorn", emoji: "🦄", label: "Unicorn" },
  { id: "robot", emoji: "🤖", label: "Robot" },
  { id: "alien", emoji: "👾", label: "Alien" },
  { id: "ninja", emoji: "🥷", label: "Ninja" },
  { id: "dragon", emoji: "🐲", label: "Dragon" },
  { id: "frog", emoji: "🐸", label: "Frog" },
  { id: "monkey", emoji: "🐵", label: "Monkey" },
  { id: "owl", emoji: "🦉", label: "Owl" },
  { id: "shark", emoji: "🦈", label: "Shark" },
];

export function getAvatar(id?: string) {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0];
}

export function randomAvatarId(exclude: string[] = []): string {
  const pool = AVATARS.filter((a) => !exclude.includes(a.id));
  const arr = pool.length ? pool : AVATARS;
  return arr[Math.floor(Math.random() * arr.length)].id;
}
