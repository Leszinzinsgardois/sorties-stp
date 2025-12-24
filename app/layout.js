import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link"; // <--- Indispensable pour le lien
import WelcomeModal from "@/components/WelcomeModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sorties MTP",
  description: "L'app des soirées étudiantes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <WelcomeModal />
        
        {/* Le contenu principal de tes pages (Dashboard, Login, etc.) */}
        <div className="min-h-screen">
            {children}
        </div>

        {/* PIED DE PAGE PERMANENT (CGU) */}
        {/* z-0 pour rester derrière les popups, pb-4 pour l'espace */}
        <footer className="py-6 pb-8 text-center text-xs text-slate-400 dark:text-slate-600">
             <p>
                 Sorties MTP (MVP) • 
                 <Link 
                    href="/legal" 
                    className="ml-1 underline hover:text-blue-500 dark:hover:text-blue-400 transition"
                 >
                    Mentions Légales & CGU
                 </Link>
             </p>
        </footer>

      </body>
    </html>
  );
}