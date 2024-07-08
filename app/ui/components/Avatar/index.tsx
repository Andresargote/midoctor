import type { UserProfile } from "@/app/lib/types";
import Image from "next/image";

export function Avatar({ profile }: { profile: UserProfile | null }) {
	const initial = () => {
		if (profile?.full_name) {
			return profile?.full_name[0].toUpperCase();
		}
		return "M"; // return and M for MiDoctor
	};

	return (
		<>
			{profile?.avatar_url ? (
				<Image
					src={profile.avatar_url}
					alt={profile.full_name}
					width={44}
					height={44}
					className="rounded-full w-11 h-11"
					style={{ objectFit: "cover" }}
				/>
			) : (
				<span className="text-xl">{initial()}</span>
			)}
		</>
	);
}
