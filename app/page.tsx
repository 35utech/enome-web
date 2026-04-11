import Navbar from "@/components/store/layout/Navbar";
import Newsletter from "@/components/store/layout/Newsletter";
import Footer from "@/components/store/layout/Footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import LazyIntegratedCollectionSlider from "@/components/store/home/LazyIntegratedCollectionSlider";
import { Metadata } from "next";
import { ConfigService } from "@/lib/services/config-service";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata(): Promise<Metadata> {
  const description = await ConfigService.get("META_DESCRIPTION", siteConfig.description);
  return {
    title: "Beranda",
    description: description,
    openGraph: {
      title: "Beranda | ÉNOMÉ",
      description: description,
    }
  };
}

export const revalidate = 3600; // Cache for 1 hour

export default function Home() {
  return (
    <ScrollArea className="h-screen w-full" scrollBarClassName="hidden">
      <div className="min-h-screen bg-white font-montserrat overflow-x-hidden no-scrollbar">
        {/* <Navbar /> */}
        <LazyIntegratedCollectionSlider />
        
        {/* <Newsletter /> */}
        <Footer />
      </div>
    </ScrollArea>
  );
}


