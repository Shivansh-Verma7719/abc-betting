'use client'
import { HeroUIProvider } from "@heroui/react";

interface LayoutWrapperProps {
    children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
    return (
        <>
            <HeroUIProvider>
                <main className="min-h-screen flex flex-col items-center bg-background">
                    {children}
                </main>
            </HeroUIProvider>
        </>
    );
}
