import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tautan Kedaluwarsa",
};

export default function ResetPasswordExpiredLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
