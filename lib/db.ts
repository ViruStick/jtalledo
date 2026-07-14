import { kv } from "@vercel/kv";
import { hashPassword, comparePassword } from "./auth";

const USERS_KEY = "users";

export interface User {
  id: string;
  name: string;
  username: string;
  password: string;
  role: "admin" | "user";
  createdAt: string;
  avatar?: string;
  despachoFiscal?: string;
}

async function getUsersData(): Promise<User[]> {
  return (await kv.get<User[]>(USERS_KEY)) ?? [];
}

async function saveUsers(users: User[]): Promise<void> {
  await kv.set(USERS_KEY, users);
}

export async function seedAdmin(): Promise<void> {
  const users = await getUsersData();
  const adminName = process.env.ADMIN_NAME || "Administrador";
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminDespacho = process.env.ADMIN_DESPACHO;

  if (!adminUsername || !adminPassword) {
    throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be set");
  }

  let needsSave = false;

  for (const user of users) {
    if (!user.name) {
      user.name = user.username;
      needsSave = true;
    }
  }

  const existingAdmin = users.find((u) => u.role === "admin");
  if (existingAdmin) {
    if (existingAdmin.name !== adminName) {
      existingAdmin.name = adminName;
      needsSave = true;
    }
    if (existingAdmin.username !== adminUsername) {
      existingAdmin.username = adminUsername;
      needsSave = true;
    }
    if (adminDespacho && existingAdmin.despachoFiscal !== adminDespacho) {
      existingAdmin.despachoFiscal = adminDespacho;
      needsSave = true;
    }
    if (!comparePassword(adminPassword, existingAdmin.password)) {
      existingAdmin.password = hashPassword(adminPassword);
      needsSave = true;
    }
  }

  if (needsSave) await saveUsers(users);

  if (!existingAdmin) {
    users.push({
      id: "1",
      name: adminName,
      username: adminUsername,
      password: hashPassword(adminPassword),
      role: "admin",
      createdAt: new Date().toISOString(),
      despachoFiscal: adminDespacho || undefined,
    });
    await saveUsers(users);
  }
}

export async function getUsers(): Promise<Omit<User, "password">[]> {
  const users = await getUsersData();
  return users.map(({ password: _, ...rest }) => rest);
}

export async function findUserByUsername(
  username: string
): Promise<User | undefined> {
  const users = await getUsersData();
  return users.find((u) => u.username === username);
}

export async function createUser(
  username: string,
  password: string,
  name: string,
  despachoFiscal?: string
): Promise<Omit<User, "password">> {
  const users = await getUsersData();
  if (users.find((u) => u.username === username)) {
    throw new Error("El usuario ya existe");
  }
  const newUser: User = {
    id: String(Date.now()),
    name,
    username,
    password: hashPassword(password),
    role: "user",
    createdAt: new Date().toISOString(),
    despachoFiscal: despachoFiscal || undefined,
  };
  users.push(newUser);
  await saveUsers(users);
  const { password: _, ...rest } = newUser;
  return rest;
}

export async function resetPassword(
  id: string,
  newPassword: string
): Promise<void> {
  const users = await getUsersData();
  const user = users.find((u) => u.id === id);
  if (!user) throw new Error("Usuario no encontrado");
  if (user.role === "admin") throw new Error("No se puede cambiar la contraseña del admin");
  user.password = hashPassword(newPassword);
  await saveUsers(users);
}

export async function updateAvatar(
  id: string,
  avatar: string | null
): Promise<void> {
  const users = await getUsersData();
  const user = users.find((u) => u.id === id);
  if (!user) throw new Error("Usuario no encontrado");
  if (avatar) {
    user.avatar = avatar;
  } else {
    delete user.avatar;
  }
  await saveUsers(users);
}

export async function updateUser(
  id: string,
  name: string,
  username: string,
  despachoFiscal?: string
): Promise<void> {
  const users = await getUsersData();
  const user = users.find((u) => u.id === id);
  if (!user) throw new Error("Usuario no encontrado");
  if (user.role === "admin") throw new Error("No se puede editar al admin");

  const existing = users.find((u) => u.username === username && u.id !== id);
  if (existing) throw new Error("El nombre de usuario ya está en uso");

  user.name = name;
  user.username = username;
  user.despachoFiscal = despachoFiscal || undefined;
  await saveUsers(users);
}

export async function deleteUser(id: string): Promise<void> {
  let users = await getUsersData();
  const user = users.find((u) => u.id === id);
  if (!user) throw new Error("Usuario no encontrado");
  if (user.role === "admin") throw new Error("No se puede eliminar al admin");
  users = users.filter((u) => u.id !== id);
  await saveUsers(users);
}
