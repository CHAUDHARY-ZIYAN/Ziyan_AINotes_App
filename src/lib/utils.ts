import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export const logger = {
  error: (message: string, error?: unknown) => {
    // In production, this would send to Sentry/LogRocket
    console.error(message, error);
  },
  warn: (message: string, data?: unknown) => {
    console.warn(message, data);
  },
  info: (message: string, data?: unknown) => {
    console.info(message, data);
  },
};