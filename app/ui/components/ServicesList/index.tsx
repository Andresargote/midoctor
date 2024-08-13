"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { X } from "react-bootstrap-icons";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../Button";
import PriceInput from "../PriceInput";
import TextInput from "../TextInput";

export function ServicesList() {
	const searchParams = useSearchParams();
	const action = searchParams.get("action");
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [isOnline, setIsOnline] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const {
		setValue,
		register,
		handleSubmit,
		reset,
		formState: { errors },
		control,
	} = useForm({
		defaultValues: {
			is_online: false,
			name: "",
			address: "",
			phone_number: "",
		},
	});

	const onSubmit = async () => {
		console.log("submit");
	};

	const handleResetFormValues = () => {
		router.back();
	};

	return (
		<>
			<Dialog.Root open={action === "new"}>
				<Dialog.Portal>
					<Dialog.Overlay className="fixed top-0 left-0 z-50 w-full h-full bg-f-black opacity-15" />

					<Dialog.Content
						aria-disabled={isLoading}
						onInteractOutside={() => {
							if (!isLoading) {
								handleResetFormValues();
							}
						}}
						onEscapeKeyDown={() => {
							if (!isLoading) {
								handleResetFormValues();
							}
						}}
						className="fixed z-50 w-full max-w-md p-8 transform shadow-sm bg-f-white rounded-2xl top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4"
						style={{
							transform: "translate(-50%, -50%)",
							width: "calc(100% - 1rem)",
						}}
						onOpenAutoFocus={(event) => {
							event.preventDefault();
						}}
					>
						<Dialog.Title className="max-w-[90%] mb-2 text-2xl font-semibold leading-relaxed text-neutral-900">
							Agregar nuevo servicio
						</Dialog.Title>
						<Dialog.Description className="mb-6 text-sm font-light leading-relaxed text-neutral-800">
							Por favor, proporciona la información necesaria para agregar un
							nuevo servicio.
						</Dialog.Description>

						<form
							className="flex flex-col gap-6"
							onSubmit={handleSubmit(onSubmit)}
						>
							<TextInput
								label="Nombre del servicio"
								id="name"
								{...register("name")}
								errorMessage={(errors.name?.message as string) ?? ""}
								autoFocus
							/>
							<PriceInput label="Precio" id="price" />
							<div className="flex items-center justify-end gap-3">
								<Dialog.Close asChild>
									<Button
										bgColorKey="neutral"
										type="button"
										disabled={isLoading}
										onClick={() => {
											handleResetFormValues();
										}}
									>
										Cancelar
									</Button>
								</Dialog.Close>

								<Button
									bgColorKey="success"
									type="submit"
									isLoading={isLoading}
									disabled={isLoading}
								>
									Guardar
								</Button>
							</div>
						</form>

						<Dialog.Close asChild>
							<button
								onClick={() => {
									handleResetFormValues();
								}}
								type="button"
								className="absolute p-2 rounded-full focused-btn top-4 right-4 bg-neutral-100"
								aria-label="Cerrar modal de creación de servicio"
							>
								<X color="#0A0A0A" width={24} height={24} />
							</button>
						</Dialog.Close>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>

			<p>Services list</p>
		</>
	);
}
