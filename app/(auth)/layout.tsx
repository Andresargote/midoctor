import Logo from '../ui/icons/Logo';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <header className="container flex justify-center pt-12 mx-auto">
          <div className="flex items-start gap-2">
            <Logo
              width={160}
              color="#1FBEB8"
              role="img"
              aria-label="MiDoctor"
            />
            <h1 className="font-light text-sx">Para profesionales</h1>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
