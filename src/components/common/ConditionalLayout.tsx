'use client';

import { usePathname } from 'next/navigation';
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname() || ''; // Default to an empty string if pathname is null

    // Routes where you don't want the header and footer
    const routesWithoutHeaderFooter = ['/auth/signin', '/reset-password'];

    const hasSurveyContent = /\/survey\/.+/.test(pathname);

    // Check if the current path matches any route without header/footer
    const hideHeaderFooter = routesWithoutHeaderFooter.includes(pathname) || hasSurveyContent;

    return (
        <div className="flex flex-col h-screen bg-white">
            <div className={` ${!hideHeaderFooter ? 'bg-primary ' : ''}`}>
                {/* Conditionally render Header */}
                {!hideHeaderFooter && <Header />}
                <main className={`flex-1 overflow-y-auto ${!hideHeaderFooter ? 'p-4 bg-white rounded-t-[37px]' : ''}`}>
                    {children}
                </main>
            </div>
            {/* Conditionally render Footer */}
            {!hideHeaderFooter && (
                <div className="fixed mt-4 bottom-2 w-full">
                    <Footer />
                </div>
            )}
        </div>
    );
}
