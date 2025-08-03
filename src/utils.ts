import process from 'node:process';

export function getEnvOrThrow(name: string): string {
  const value = process.env[name];
  if (value == null) {
    throw Error(`Envirnoment variable ${name} must be set`);
  }
  return value;
}

export function getEnvOrDefault(name: string, defaultValue: string): string {
  return process.env[name] ?? defaultValue;
}
