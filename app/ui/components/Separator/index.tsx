import type { PropsWithChildren } from 'react';

export function Separator({ children }: PropsWithChildren) {
	return (
		<div className="flex items-center gap-3 mb-7">
			<hr className="flex-1 border-[1.5px] border-t border-neutral-200" />
			<span className="text-xs font-semibold uppercase text-neutral-200">
				{children}
			</span>
			<hr className="flex-1 border-[1.5px] border-t border-neutral-200" />
		</div>
	);
}
