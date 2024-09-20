'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type PreviewFile = {
	file?: File;
	url: string;
};

type UploadAvatarProps = {
	isLoading?: boolean;
	defaultAvatarUrl?: string;
	// eslint-disable-next-line no-unused-vars
	handleSetAvatarFileBeforeUpload: (file: File) => void;
};

export function UploadAvatar({
	isLoading = false,
	defaultAvatarUrl,
	handleSetAvatarFileBeforeUpload,
}: UploadAvatarProps) {
	console.log(isLoading);
	const [previewAvatarUrl, setPreviewAvatarUrl] = useState<null | PreviewFile>(
		null,
	);

	const handleUploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
		const reader = new FileReader();
		const file = e.target.files?.[0];

		reader.onloadend = () => {
			setPreviewAvatarUrl({
				file: file as File,
				url: reader.result as string,
			});
			handleSetAvatarFileBeforeUpload(file as File);
		};

		reader.readAsDataURL(file as Blob);
		console.log(reader);
	};

	useEffect(() => {
		if (defaultAvatarUrl) {
			setPreviewAvatarUrl({
				url: defaultAvatarUrl,
			});
		}
	}, [defaultAvatarUrl]);

	console.log(previewAvatarUrl, defaultAvatarUrl);

	return (
		<div className="flex flex-wrap items-center gap-4">
			<button
				type="button"
				onClick={e => {
					e.preventDefault();
					const avatar = document.getElementById('avatar');
					avatar?.click();
				}}
				className="w-20 h-20 text-center rounded-full bg-primary-500 text-f-white"
			>
				{previewAvatarUrl?.url ? (
					<Image
						src={previewAvatarUrl.url}
						alt="Avatar"
						width={80}
						height={80}
						className="object-cover w-20 h-20 rounded-full"
					/>
				) : (
					<span className="text-3xl">A</span>
				)}
			</button>

			<div>
				<button
					role="button"
					type="button"
					onClick={e => {
						e.preventDefault();
						const avatar = document.getElementById('avatar');
						avatar?.click();
					}}
					className="p-3 rounded-lg bg-neutral-100"
				>
					Agrega tu imagen de perfil...
				</button>
				<input
					id="avatar"
					type="file"
					accept="image/*"
					className="hidden"
					onChange={handleUploadAvatar}
				/>
			</div>
		</div>
	);
}
