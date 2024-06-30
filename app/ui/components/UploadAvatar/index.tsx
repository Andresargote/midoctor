'use client';

export function UploadAvatar() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        onClick={(e) => {
          e.preventDefault();
          const avatar = document.getElementById('avatar');
          avatar?.click();
        }}
        className="w-20 h-20 text-center rounded-full bg-primary-500 text-f-white"
      >
        <span className="text-3xl">A</span>
      </button>
      <div>
        <button
          role="button"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            const avatar = document.getElementById('avatar');
            avatar?.click();
          }}
          className="p-3 rounded-lg bg-neutral-100"
        >
          Agrega tu imagen de perfil...
        </button>
        <input id="avatar" type="file" accept="image/*" className="hidden" />
      </div>
    </div>
  );
}
