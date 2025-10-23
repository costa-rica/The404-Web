import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Reset Password - The 404",
	description: "Set your new password",
};

export default function ResetPassword({
	params,
}: {
	params: { token: string };
}) {
	return <ResetPasswordForm token={params.token} />;
}
