"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { User, Menu } from "lucide-react";
import UserSidebar from "./UserSidebar";

export default function AccountSidebarMobile() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="default"
                    size="icon"
                    className="lg:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-neutral-base-900 border-none text-white shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:bg-neutral-base-800 active:scale-95 transition-all z-50 group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-neutral-base-900 group-hover:bg-neutral-base-800 transition-colors" />
                    <User className="w-6 h-6 relative z-10 transition-transform group-hover:scale-110" />
                    <span className="sr-only">Menu Akun</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 border-r-0 w-[300px]">
                <div className="sr-only">
                    <SheetHeader>
                        <SheetTitle>Menu Akun</SheetTitle>
                        <SheetDescription>Akses berbagai menu akun Anda</SheetDescription>
                    </SheetHeader>
                </div>
                <div className="py-10 px-6 h-full overflow-y-auto">
                    <UserSidebar isSheet className="w-full" />
                </div>
            </SheetContent>
        </Sheet>
    );
}
