export class CarApiError extends Error {
  constructor(message: string, public code: "config" | "auth" | "access" | "quota" | "network" | "response") {
    super(message);
  }
}
