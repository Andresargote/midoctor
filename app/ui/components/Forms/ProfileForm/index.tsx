'use client';

import { updateProfile } from '@/app/app/mi-perfil/action';
import type { UserProfile } from '@/app/lib/types';
import { Button } from '@/app/ui/components/Button';
import TextInput from '@/app/ui/components/TextInput';
import TextareaInput from '@/app/ui/components/TextareaInput';
import { UploadAvatar } from '@/app/ui/components/UploadAvatar';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Toast } from '../../Toast';
import { profileSchema } from './validate-schema';

type ProfileFormProps = {
	profile: UserProfile | null;
	profileError: boolean;
	email: string;
};

export type UserFormDefaultValues = {
	username: string;
	full_name: string;
	profession: string;
	about_me: string;
	avatar_url: string;
};

export function ProfileForm({
	profile,
	profileError,
	email,
}: ProfileFormProps) {
	const [isSuccess, setIsSuccess] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [isProfileError, setIsProfileError] = useState(false);
	const [avatarImg, setAvatarImg] = useState<File | null>(null);

	useEffect(() => {
		if (profileError) {
			setIsProfileError(true);
		}
	}, [profileError]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UserFormDefaultValues>({
		defaultValues: {
			username: profile?.username ?? '',
			full_name: profile?.full_name ?? '',
			profession: profile?.profession ?? '',
			about_me: profile?.about_me ?? '',
			avatar_url: profile?.avatar_url ?? '',
		},
		resolver: zodResolver(profileSchema),
	});

	const onSubmit = async (formValues: UserFormDefaultValues) => {
		setIsSuccess(false);
		setIsError(false);
		setIsLoading(true);
		try {
			if (avatarImg) {
				const signature = await fetch('/api/img/signature').then(r => r.json());

				if (!signature) {
					throw new Error('Error al generar la firma');
				}

				const avatarFormData = new FormData();
				avatarFormData.append('file', avatarImg as File);
				avatarFormData.append('resource_type', 'image');
				avatarFormData.append('api_key', signature.api_key);
				avatarFormData.append('timestamp', `${signature.timestamp}`);
				avatarFormData.append(
					'upload_preset',
					process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? '',
				);
				avatarFormData.append('signature', signature.signature);

				const avatarImgResponse = await fetch(
					`${process.env.NEXT_PUBLIC_CLOUDINARY_API}`,
					{
						method: 'POST',
						body: avatarFormData,
					},
				);
				const avatarImgData = await avatarImgResponse.json();

				formValues.avatar_url = avatarImgData.secure_url;
			}

			await updateProfile({
				id: profile?.id as string,
				...formValues,
				email,
			});

			setIsSuccess(true);
		} catch (error) {
			console.error(error);
			setIsError(true);
		} finally {
			setIsLoading(false);
		}
	};

	const formatUsername = (value: string) => {
		return value.toLowerCase().replace(/\s/g, '-').trim();
	};

	return (
		<>
			<form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
				<UploadAvatar
					defaultAvatarUrl={profile?.avatar_url ?? ''}
					handleSetAvatarFileBeforeUpload={file => setAvatarImg(file)}
				/>
				<TextInput
					label="Nombre de usuario"
					id="user-name"
					{...register('username')}
					errorMessage={(errors.username?.message as string) ?? ''}
					handleInputFormatter={formatUsername}
				/>
				<TextInput
					label="Nombre completo"
					id="full-name"
					{...register('full_name')}
					errorMessage={(errors.full_name?.message as string) ?? ''}
				/>
				<TextInput
					label="Profesión"
					id="profession"
					{...register('profession')}
					errorMessage={(errors.profession?.message as string) ?? ''}
				/>
				<TextareaInput
					label="Sobre mí"
					id="about-me"
					placeholder="Escribe algo sobre ti"
					{...register('about_me')}
					errorMessage={(errors.about_me?.message as string) ?? ''}
				/>
				<Button disabled={isLoading} type="submit" isLoading={isLoading}>
					Guardar cambios
				</Button>
			</form>
			{isSuccess && (
				<Toast type="success" message="¡Perfil actualizado correctamente!" />
			)}
			{isProfileError && (
				<Toast
					type="error"
					message="Ocurrió un error al cargar tu perfil. Si el problema persiste, contacta con soporte"
				/>
			)}
			{isError && (
				<Toast
					type="error"
					message="Ocurrió un error al intentar guardar los cambios. Si el problema persiste, contacta con soporte"
				/>
			)}
		</>
	);
}
