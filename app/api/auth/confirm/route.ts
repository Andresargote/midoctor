import type { EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/app/lib/utils/supabase/server";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const token_hash = searchParams.get("token_hash");
	const type = searchParams.get("type") as EmailOtpType | null;
	const next = searchParams.get("next") ?? "/";

	const redirectTo = request.nextUrl.clone();
	redirectTo.pathname = next;
	redirectTo.searchParams.delete("token_hash");
	redirectTo.searchParams.delete("type");

	if (token_hash && type) {
		const supabase = createClient();

		const { error } = await supabase.auth.verifyOtp({
			type,
			token_hash,
		});

		if (!error) {
			if (type === "magiclink") {
				redirectTo.searchParams.delete("next");
				redirectTo.pathname = "/app";
				return NextResponse.redirect(redirectTo);
			}

			if (type === "signup") {
				redirectTo.searchParams.delete("next");
				redirectTo.pathname = "/bienvenido";
				return NextResponse.redirect(redirectTo);
			}
		}
	}

	// return the user to an error page with some instructions
	redirectTo.pathname = "/error";
	redirectTo.searchParams.set("error", "invalid-auth");
	return NextResponse.redirect(redirectTo);
}
