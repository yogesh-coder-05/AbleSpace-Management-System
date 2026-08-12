import './globals.css';
import React from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import { ColorModeProvider } from '../context/ColorModeContext';
import { GuestProvider } from '../context/GuestContext';

export const metadata = {
  title: 'AbleSpace Task Management Dashboard',
  description: 'Full Stack Task Management Web Application matched 100% with Figma specs',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ColorModeProvider>
            <GuestProvider>{children}</GuestProvider>
          </ColorModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
