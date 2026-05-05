import { ReactNode } from "react";
import { Link } from "wouter";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between mx-auto px-4">
          <Link href="/" className="font-bold tracking-tighter text-xl text-primary hover:opacity-80 transition-opacity">
            MCView
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/tools" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Tools
            </Link>
            <Link href="/tools/skin-renderer" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Skin Renderer
            </Link>
            <Link href="/tools/thumbnail-generator" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Thumbnails
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="border-t border-border py-8 mt-auto bg-card">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MCView. All rights reserved.</p>
          <p>Professional Minecraft Content Suite.</p>
        </div>
      </footer>
    </div>
  );
}
