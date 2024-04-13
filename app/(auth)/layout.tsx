export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='es'>
      <body>
        <p>AuthLayout</p>
        {children}
      </body>
    </html>
  );
}
