import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Detail Pesanan",
};

export default function OrderDetailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
