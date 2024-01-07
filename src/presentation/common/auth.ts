export const permissions = (
  level: number | "ADMIN" | "MANAGER" | "INSTRUCTOR" | "DEVELOPER",
): [number, string] => {
  switch (level) {
    case 0 || "ADMIN":
      return [0, "ADMIN"];
    case 1 || "MANAGER":
      return [1, "MANAGER"];
    case 2 || "INSTRUCTOR":
      return [2, "INSTRUCTOR"];
    case 3 || "DEVELOPER":
      return [3, "DEVELOPER"];
    default:
      throw new Error("Invalid permission level");
  }
};

export type Payload = Record<string, { email: string; permission: [number, string] }>;
