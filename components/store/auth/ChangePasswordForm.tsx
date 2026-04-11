"use client";

import { useState } from "react";
import { Loader2, Lock, Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChangePassword } from "@/hooks/use-profile";
import { m, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/use-auth";

const changePasswordSchema = z.object({
    newPassword: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
});

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordForm() {
    const [showPasswords, setShowPasswords] = useState({
        new: false,
        confirm: false
    });

    const [isFocused, setIsFocused] = useState<string | null>(null);
    const { user } = useAuth();
    const isGoogleAuth = user?.authenticatedBy === "google";

    const changePasswordMutation = useChangePassword();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<ChangePasswordValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: ""
        }
    });

    const onSubmit = (data: ChangePasswordValues) => {
        changePasswordMutation.mutate(data, {
            onSuccess: () => {
                reset();
            }
        });
    };

    const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[24px] md:rounded-[32px] p-6 sm:p-8 md:p-12 border border-neutral-base-100 shadow-sm transition-all duration-300 hover:shadow-md"
        >
            {isGoogleAuth && (
                <m.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-5 bg-blue-50/50 rounded-[20px] border border-blue-100/50 space-y-3"
                >
                    <div className="flex items-center gap-3 text-neutral-base-900">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                />
                            </svg>
                        </div>
                        <span className="text-[13px] font-black uppercase tracking-wider">Akun Terhubung Google</span>
                    </div>
                    <p className="text-[14px] text-neutral-base-500 font-medium leading-relaxed">
                        Anda mendaftar menggunakan akun Google. Jika Anda ingin login secara manual nantinya, Anda bisa menetapkan password baru di sini.
                    </p>
                </m.div>
            )}

            <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-16">
                {/* Header Info */}
                <div className="lg:w-1/3 space-y-4">
                    <div className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-neutral-base-900/5 rounded-full border border-neutral-base-900/10">
                        <Lock className="w-3.5 h-3.5 text-neutral-base-900" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-base-900">Keamanan Akun</span>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-[20px] md:text-[24px] font-black text-[#111827] leading-tight">Ubah Password</h3>
                        <p className="text-[14px] leading-relaxed text-neutral-base-500 font-medium">
                            Jaga keamanan akun Anda dengan memperbarui password secara rutin. Gunakan kombinasi yang kuat dan unik.
                        </p>
                    </div>
                </div>

                {/* Form Section */}
                <div className="flex-1 max-w-xl">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 gap-5">
                            {/* New Password */}
                            <div className="space-y-2.5">
                                <label className="text-[13px] font-bold text-[#111827] ml-1">Password Baru</label>
                                <div className="relative group">
                                    <div className={`absolute -inset-0.5 bg-neutral-base-900 rounded-[14px] opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${isFocused === 'newPassword' ? 'opacity-10' : ''}`} />
                                    <Input
                                        type={showPasswords.new ? "text" : "password"}
                                        {...register("newPassword")}
                                        onFocus={() => setIsFocused('newPassword')}
                                        onBlur={() => setIsFocused(null)}
                                        placeholder="Masukkan password baru"
                                        className={`relative h-13 bg-white border-neutral-base-100/80 rounded-[14px] px-5 pr-12 text-[14px] font-medium focus:border-neutral-base-900 focus:ring-0 transition-all duration-300 ${errors.newPassword ? 'border-red-500 focus:border-red-500' : ''}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility("new")}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-base-400 hover:text-neutral-base-900 transition-colors z-10"
                                    >
                                        {showPasswords.new ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                                    </button>
                                </div>
                                <AnimatePresence>
                                    {errors.newPassword && (
                                        <m.p
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="text-[12px] text-red-500 font-bold flex items-center gap-1.5 ml-1 mt-1"
                                        >
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            {errors.newPassword.message}
                                        </m.p>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2.5">
                                <label className="text-[13px] font-bold text-[#111827] ml-1">Konfirmasi Password Baru</label>
                                <div className="relative group">
                                    <div className={`absolute -inset-0.5 bg-neutral-base-900 rounded-[14px] opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${isFocused === 'confirmPassword' ? 'opacity-10' : ''}`} />
                                    <Input
                                        type={showPasswords.confirm ? "text" : "password"}
                                        {...register("confirmPassword")}
                                        onFocus={() => setIsFocused('confirmPassword')}
                                        onBlur={() => setIsFocused(null)}
                                        placeholder="Ulangi password baru"
                                        className={`relative h-13 bg-white border-neutral-base-100/80 rounded-[14px] px-5 pr-12 text-[14px] font-medium focus:border-neutral-base-900 focus:ring-0 transition-all duration-300 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility("confirm")}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-base-400 hover:text-neutral-base-900 transition-colors z-10"
                                    >
                                        {showPasswords.confirm ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                                    </button>
                                </div>
                                <AnimatePresence>
                                    {errors.confirmPassword && (
                                        <m.p
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="text-[12px] text-red-500 font-bold flex items-center gap-1.5 ml-1 mt-1"
                                        >
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            {errors.confirmPassword.message}
                                        </m.p>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="flex pt-4">
                            <AnimatePresence mode="wait">
                                <Button
                                    key={changePasswordMutation.isPending ? "loading" : "idle"}
                                    type="submit"
                                    disabled={changePasswordMutation.isPending}
                                    className="h-12 md:h-13 px-10 bg-[#111827] text-white rounded-2xl text-[14px] font-bold shadow-xl shadow-gray-900/10 hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full flex items-center justify-center gap-3 group"
                                >
                                    {changePasswordMutation.isPending ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <span>Simpan Password Baru</span>
                                            <m.div
                                                animate={{ x: [0, 4, 0] }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                            >
                                                <Lock className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                                            </m.div>
                                        </>
                                    )}
                                </Button>
                            </AnimatePresence>
                        </div>
                    </form>
                </div>
            </div>
        </m.div>
    );
}
