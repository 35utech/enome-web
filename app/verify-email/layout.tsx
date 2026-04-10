import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Verifikasi Email",
};

export default function VerifyEmailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
