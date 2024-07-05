import React from "react";

export default function Google({ width = 18, ...props }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={width}
			height={width}
			fill="none"
			viewBox="0 0 55 57"
			{...props}
		>
			<title>Google</title>
			<path
				fill="#4280EF"
				d="M55 28.732a35.1 35.1 0 00-.49-5.685H28.041v10.82h15.16a12.754 12.754 0 01-5.624 8.497l9.047 7.03C51.944 44.442 55 37.229 55 28.732z"
			/>
			<path
				fill="#34A353"
				d="M28.046 56.118c7.58 0 13.937-2.506 18.583-6.785l-9.047-6.97c-2.506 1.712-5.746 2.69-9.536 2.69-7.336 0-13.51-4.951-15.772-11.553l-9.292 7.152c4.769 9.475 14.427 15.466 25.064 15.466z"
			/>
			<path
				fill="#F6B704"
				d="M12.272 33.439a17.047 17.047 0 010-10.759L2.98 15.467c-3.973 7.947-3.973 17.3 0 25.185l9.292-7.213z"
			/>
			<path
				fill="#E54335"
				d="M28.046 11.127a15.308 15.308 0 0110.758 4.218l8.009-8.07C41.739 2.508 35.014-.06 28.046.002 17.409.001 7.75 5.991 2.982 15.467l9.292 7.213c2.262-6.663 8.436-11.553 15.772-11.553z"
			/>
		</svg>
	);
}
