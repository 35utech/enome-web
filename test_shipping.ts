import { ShippingService } from "./lib/services/shipping-service";
import { ConfigService } from "./lib/services/config-service";
import { CONFIG } from "./lib/config";

async function test() {
    const apiKey = await ConfigService.get(CONFIG.RAJAONGKIR_KEY_VAR);
    console.log("Using API Key:", apiKey ? "FOUND" : "NOT FOUND");
    
    const origin = "5870"; // Cimahi
    const destination = "5866"; // Siwalan
    const weight = 1000;
    const courier = "wahana";

    // Use a simplified version of fetchKomerce logic
    const response = await fetch("https://rajaongkir.komerce.id/api/v1/calculate/district/domestic-cost", {
        method: "POST",
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            "key": apiKey
        },
        body: new URLSearchParams({
            origin: String(origin),
            destination: String(destination),
            weight: String(weight),
            courier: courier,
            price: "lowest"
        })
    });

    const data = await response.json();
    console.log("Full Response:", JSON.stringify(data, null, 2));
}

test().catch(console.error);
