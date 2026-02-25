import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { centralConfig, companyProfile, cargo } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import logger from "@/lib/logger";
import { CONFIG } from "@/lib/config";

/**
 * Handler untuk menghitung ongkos kirim menggunakan API RajaOngkir.
 * Alur:
 * 1. Ambil API Key RajaOngkir dari tabel konfigurasi.
 * 2. Ambil kota asal pengiriman dari profil perusahaan.
 * 3. Kirim request ke API RajaOngkir Pro.
 * 4. Berikan data ongkir ke frontend.
 */
export async function POST(request: NextRequest) {
    logger.info("API Request: POST /api/shipping");
    try {
        const body = await request.json();
        const { destination, weight, courier } = body;

        logger.info("Shipping Calc: Request received", { destination, weight, courier });

        if (!destination || !weight || !courier) {
            logger.warn("Shipping Calc: Missing parameters");
            return NextResponse.json({ message: "missing_params" }, { status: 400 });
        }

        // 1. Ambil API Key RajaOngkir
        const [config]: any = await db.select()
            .from(centralConfig)
            .where(eq(centralConfig.variable, CONFIG.RAJAONGKIR_KEY_VAR))
            .limit(1);

        if (!config?.value) {
            logger.error(`Shipping Calc: ${CONFIG.RAJAONGKIR_KEY_VAR} not found in DB`);
            return NextResponse.json({ message: "rajaongkir_key_not_found" }, { status: 500 });
        }

        // 2. Ambil Kota Asal (Origin) dari Profil Perusahaan
        const [company]: any = await db.select()
            .from(companyProfile)
            .where(eq(companyProfile.isAktif, 1))
            .limit(1);

        const origin = company?.kota || CONFIG.DEFAULT_ORIGIN_CITY;

        // 3. Ambil daftar kurir aktif dari DB
        const activeCouriers = await db.select()
            .from(cargo)
            .where(eq(cargo.isAktif, 1));

        const excludedCodes = ["jtr", "cod", "instantkurir", "pickup", "cashless", "gratis"];
        const courierCodes = activeCouriers
            .map(c => c.code?.toLowerCase())
            .filter(code => code && !excludedCodes.includes(code))
            .join(':') || 'jne:sicepat:jnt';

        // Override manual untuk kurir internal/khusus yang biayanya 0 atau fixed
        if (["jtr", "cod", "instantkurir", "pickup", "cashless", "gratis"].includes(courier.toLowerCase())) {
            logger.debug("Shipping Calc: Manual override applied", { courier });
            return NextResponse.json({
                rajaongkir: {
                    results: [{
                        costs: [{
                            service: courier.toUpperCase(),
                            cost: [{ value: 0, etd: "", note: "" }]
                        }]
                    }]
                }
            });
        }

        // 4. Panggil API Komerce untuk SEMUA kurir aktif
        logger.debug("Shipping Calc: Calling Komerce API", { origin, destination, weight, courierCodes });
        const response = await fetch("https://rajaongkir.komerce.id/api/v1/calculate/district/domestic-cost", {
            method: "POST",
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "key": config.value
            },
            body: new URLSearchParams({
                origin: origin,
                destination: destination.toString(),
                weight: weight.toString(),
                courier: courierCodes,
                price: "lowest"
            })
        });

        // C4N2U3s71af1878ea724a8d6X5PpcQpb

        const data = await response.json();

        if (response.ok) {
            logger.info("Shipping Calc: Success", { data });

            // Transform Komerce to RajaOngkir structure for frontend compatibility
            const transformedData = {
                rajaongkir: {
                    results: [{
                        costs: data?.data?.map((item: any) => ({
                            service: `${item.name} - ${item.service}`,
                            courierCode: item.code,
                            courierName: item.name,
                            cost: [{
                                value: item.cost,
                                etd: item.etd,
                                note: item.description || ""
                            }]
                        })) || []
                    }]
                }
            };
            return NextResponse.json(transformedData);
        } else {
            logger.error("Shipping Calc: Komerce API Failure", { status: response.status, data });
            return NextResponse.json(data, { status: response.status });
        }

    } catch (error: any) {
        logger.error("API Error: /api/shipping", { error: error.message });
        return NextResponse.json({ message: "error", error: error.message }, { status: 500 });
    }
}

