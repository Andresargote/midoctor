export default function Error() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="mb-12 text-3xl font-semibold text-f-black">
        ¡Ups! Algo salió mal.
      </h1>
      <p className="leading-relaxed text-neutral-500">
        Si el error persiste, por favor contacta con{' '}
        {/*Todo: change the email address */}
        <a href="mailto:test@gmail.com" className="underline text-primary-500">
          soporte
        </a>
      </p>
    </div>
  );
}
