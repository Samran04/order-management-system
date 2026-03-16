import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uniform Studio 81 API",
  description: "Backend API for Uniform Studio 81",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
