"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
// Cambia la ruta de importación de los tipos a esta:
import { type ThemeProviderProps } from "next-themes"; 

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}