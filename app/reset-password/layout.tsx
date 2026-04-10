import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Reset Kata Sandi",
};

export default function ResetPasswordLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
