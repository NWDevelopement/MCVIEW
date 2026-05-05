import { Link } from "wouter";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Tools() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">Creative Suite</h1>
        <p className="text-xl text-muted-foreground max-w-2xl font-light">
          Select a tool to begin your creative process. All tools are fully integrated and run entirely in your browser.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full flex flex-col rounded-none border-border bg-card/50 hover:bg-card transition-colors">
            <CardHeader>
              <CardTitle className="uppercase tracking-widest text-xl mb-2">Skin Renderer</CardTitle>
              <CardDescription className="text-base">
                Professional 3D rendering engine for Minecraft skins. Extract high-res avatars or set up complex animated poses.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto pt-6">
              <Button asChild className="w-full rounded-none uppercase font-bold tracking-wide" size="lg">
                <Link href="/tools/skin-renderer">Launch Renderer</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full flex flex-col rounded-none border-border bg-card/50 hover:bg-card transition-colors">
            <CardHeader>
              <CardTitle className="uppercase tracking-widest text-xl mb-2">Thumbnail Generator</CardTitle>
              <CardDescription className="text-base">
                AI-powered image generation specifically tuned for high-CTR Minecraft content. Set the scene, pick a vibe, and render.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto pt-6">
              <Button asChild className="w-full rounded-none uppercase font-bold tracking-wide" size="lg">
                <Link href="/tools/thumbnail-generator">Launch Generator</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
