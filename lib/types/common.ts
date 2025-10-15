export type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export const ok = <T>(value: T): Result<T> => ({ ok: true, value });
export const err = <E>(error: E): Result<never, E> => ({
  ok: false,
  error,
});

export enum AppError {
  Unauthenicated = "Unauthenicated",
  Unauthorized = "Unauthorized",
  UserAlreadyExists = "UserAlreadyExists",
  NotFound = "NotFound",
  Misc = "Misc",
}
