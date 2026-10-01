import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Agentic Ops — AI Operations Control Center',
  description:
    'Multi-Agent AI systems for research, analysis and business automation. Interactive portfolio demonstration of multi-agent orchestration, tool calling, and AI observability.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background-deep text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
