import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Wishlist Saya",
};

export default function WishlistLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
