import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pesanan Berhasil",
};

export default function CheckoutSuccessLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
