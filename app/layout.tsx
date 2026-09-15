import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DOMAINS | Interactive Fantasy Realms',
  description:
    'Enter the interactive cinematic domains of Data Science, Machine Learning, Natural Language Processing, and Computer Vision.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Inter:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#020408', overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  );
}
