// lib/utils.ts

// Utility function to combine class names conditionally
export function cn(...classes: (string | false | undefined | null)[]) {
    return classes.filter(Boolean).join(' ');
  }
  