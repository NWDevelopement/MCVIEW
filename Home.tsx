import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800/20 via-background to-background"></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="z-10 max-w-4xl space-y-6"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase">
            The Professional<br/>Minecraft Suite.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light">
            High-end creative tools for serious content creators. Generate thumbnails and render skins with zero friction.
          </p>
          <div className="pt-8">
            <Button asChild size="lg" className="h-14 px-8 text-lg rounded-none uppercase font-bold tracking-wider">
              <Link href="/tools">Explore Our Creative Suite</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* What We Do */}
      <section className="py-24 bg-card border-y border-border px-4">
        <div className="container mx-auto max-w-5xl text-center space-y-8">
          <h2 className="text-3xl font-bold uppercase tracking-tight">Purpose Built.</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            MCView bridges the gap between Minecraft and high-end design. We provide a tailored environment for creators who demand crisp visuals, fast workflows, and professional output without the clutter.
          </p>
        </div>
      </section>

      {/* How it Works / Tools Showcase */}
      <section className="py-32 px-4 container mx-auto">
        <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="h-64 bg-secondary flex items-center justify-center border border-border">
              <span className="text-muted-foreground uppercase tracking-widest text-sm">Interactive 3D Space</span>
            </div>
            <h3 className="text-2xl font-bold uppercase">Skin Renderer</h3>
            <p className="text-muted-foreground">
              Real-time 3D skin manipulation. Extract perfect body and face renders, or pose your character with our advanced animation controls. Export crisp PNGs instantly.
            </p>
            <Button asChild variant="outline" className="rounded-none uppercase tracking-wide">
              <Link href="/tools/skin-renderer">Launch Renderer</Link>
            </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="h-64 bg-secondary flex items-center justify-center border border-border">
              <span className="text-muted-foreground uppercase tracking-widest text-sm">AI Generation Engine</span>
            </div>
            <h3 className="text-2xl font-bold uppercase">Thumbnail Generator</h3>
            <p className="text-muted-foreground">
              Describe your vision, pick a style, and let our fine-tuned AI model generate striking, highly-clickable YouTube thumbnails. Zero artistic skills required.
            </p>
            <Button asChild variant="outline" className="rounded-none uppercase tracking-wide">
              <Link href="/tools/thumbnail-generator">Launch Generator</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Why MCView */}
      <section className="py-24 bg-card border-t border-border px-4">
         <div className="container mx-auto max-w-4xl text-center space-y-12">
            <h2 className="text-3xl font-bold uppercase tracking-tight">The Standard for Creators</h2>
            <div className="grid sm:grid-cols-3 gap-8 text-left">
              <div className="space-y-3">
                <h4 className="font-bold text-lg uppercase border-b border-border pb-2">Fast</h4>
                <p className="text-muted-foreground text-sm">Zero load times. Instant previews. Built to respect your workflow.</p>
              </div>
              <div className="space-y-3">
                <h4 className="font-bold text-lg uppercase border-b border-border pb-2">Clean</h4>
                <p className="text-muted-foreground text-sm">No ads, no clutter, no distractions. Just you and your canvas.</p>
              </div>
              <div className="space-y-3">
                <h4 className="font-bold text-lg uppercase border-b border-border pb-2">Precise</h4>
                <p className="text-muted-foreground text-sm">High resolution exports and accurate 3D rendering engine.</p>
              </div>
            </div>
         </div>
      </section>
    </div>
  );
}
