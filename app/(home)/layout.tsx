export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <p>App layout</p>
        {children}
      </body>
    </html>
  );
}
