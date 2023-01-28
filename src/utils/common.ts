export function exclude<T, Key extends keyof T>(
  obj: T,
  keys: Key[]
): T {
  for (let key of keys) {
    delete obj[key];
  }
  return obj;
}
