'use client';

import { useState } from 'react';
import { Button } from '../Button';

type GeneralWrapperProps = {
	userId: string;
	title: string;
	description: string;
	btnText: string;
	conditionalShowBtn?: boolean;
	AddModal: any;
	Content: any;
	data: any[];
};

export function GeneralWrapper({
	userId,
	title,
	description,
	btnText,
	conditionalShowBtn = false,
	AddModal,
	Content,
	data,
}: GeneralWrapperProps) {
	const [currentData, setCurrentData] = useState(data);
	const [isOpen, setIsOpen] = useState(false);

	const handleAddData = (data: any) => {
		setCurrentData([...currentData, data]);
	};

	const showBtn = () => {
		if (conditionalShowBtn) {
			return data?.length === 0;
		}
		return true;
	};

	return (
		<div className="px-4 py-6 mx-auto">
			<div className="container mx-auto lg:pl-72">
				<header className="flex flex-col justify-between w-full gap-6 mb-12 md:flex-row">
					<div>
						<h1 className="mb-2 text-3xl font-semibold text-neutral-900">
							{title}
						</h1>
						<p className="font-light leading-relaxed text-neutral-800">
							{description}
						</p>
					</div>

					{showBtn() && (
						<Button
							onClick={() => {
								setIsOpen(!isOpen);
							}}
							style={{
								height: '56px',
							}}
						>
							{btnText}
						</Button>
					)}
				</header>
				<Content userId={userId} data={currentData} />
				<AddModal
					opened={isOpen}
					userId={userId}
					handleCloseModal={() => {
						setIsOpen(false);
					}}
					handleOnSuccess={handleAddData}
				/>
			</div>
		</div>
	);
}
