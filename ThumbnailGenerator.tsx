import { useState, useRef, useCallback, useEffect } from "react";
import { useGenerateThumbnail } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Download, RefreshCw, Upload, X, ImageIcon } from "lucide-react";

type StyleType = "epic" | "dramatic" | "funny" | "chill";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const GENERATING_MESSAGES = [
  "Analysing scene description...",
  "Composing Minecraft environment...",
  "Placing blocks and lighting...",
  "Rendering character detail...",
  "Applying style treatment...",
  "Optimising for high CTR...",
  "Polishing final composition...",
  "Almost ready...",
];

function GeneratingOverlay({ elapsed }: { elapsed: number }) {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setMsgIdx((i) => (i + 1) % GENERATING_MESSAGES.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  const pct = Math.min((elapsed / 120) * 100, 99);
  const secs = elapsed % 60;
  const mins = Math.floor(elapsed / 60);
  const timeLabel = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm z-10 space-y-8 px-8">
      {/* Animated Wand */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin" />
        <div className="absolute inset-3 border-r-2 border-muted-foreground/30 rounded-full animate-[spin_2s_linear_infinite_reverse]" />
        <div className="absolute inset-6 border-t border-primary/40 rounded-full animate-[spin_3s_linear_infinite]" />
        <Wand2 className="w-5 h-5 text-primary" />
      </div>

      {/* Status message */}
      <div className="text-center space-y-2 w-full max-w-xs">
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIdx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="uppercase tracking-widest text-xs font-bold text-primary"
          >
            {GENERATING_MESSAGES[msgIdx]}
          </motion.p>
        </AnimatePresence>
        <p className="text-xs text-muted-foreground/50">AI is crafting your thumbnail</p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs space-y-2">
        <div className="w-full h-px bg-border overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground/40 uppercase tracking-widest">
          <span>{timeLabel} elapsed</span>
          <span>up to 2 min</span>
        </div>
      </div>
    </div>
  );
}

export default function ThumbnailGenerator() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<StyleType>("epic");
  const [playerUsername, setPlayerUsername] = useState("");
  const [title, setTitle] = useState("");
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [referencePreview, setReferencePreview] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const generateMutation = useGenerateThumbnail();

  // Elapsed timer — runs while pending
  useEffect(() => {
    if (generateMutation.isPending) {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [generateMutation.isPending]);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setReferenceFile(file);
    const url = URL.createObjectURL(file);
    setReferencePreview(url);
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const clearReference = useCallback(() => {
    setReferenceFile(null);
    if (referencePreview) URL.revokeObjectURL(referencePreview);
    setReferencePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [referencePreview]);

  const handleGenerate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!prompt.trim()) return;

      let referenceImageBase64: string | null = null;
      if (referenceFile) {
        referenceImageBase64 = await fileToBase64(referenceFile);
      }

      generateMutation.mutate({
        data: {
          prompt,
          style,
          playerUsername: playerUsername.trim() || null,
          title: title.trim() || null,
          referenceImageBase64,
        },
      });
    },
    [prompt, style, playerUsername, title, referenceFile, generateMutation]
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-2 mb-12">
        <h1 className="text-3xl font-bold uppercase tracking-tight">
          Thumbnail Generator
        </h1>
        <p className="text-muted-foreground font-light">
          AI-powered thumbnail concept art tailored for high CTR.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12">
        {/* Form */}
        <div className="space-y-8">
          <form onSubmit={handleGenerate} className="space-y-6">
            {/* Reference Image Upload */}
            <div className="space-y-3">
              <Label className="uppercase tracking-widest text-xs font-bold text-muted-foreground">
                Reference Photo (Optional)
              </Label>
              {referencePreview ? (
                <div className="relative border border-border group">
                  <img
                    src={referencePreview}
                    alt="Reference"
                    className="w-full h-36 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-white hover:bg-white/20 rounded-none uppercase text-xs tracking-widest"
                      onClick={clearReference}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                  <div className="px-3 py-2 bg-card border-t border-border">
                    <p className="text-xs text-muted-foreground truncate">
                      {referenceFile?.name}
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className="border border-dashed border-border h-36 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-card/30 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  data-testid="dropzone-reference"
                >
                  <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Drop image or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground/50 mt-1">
                    PNG, JPG, WEBP
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleFileInputChange}
                data-testid="input-reference-file"
              />
              <p className="text-xs text-muted-foreground/60">
                Upload a photo of yourself or a character — the AI will
                incorporate it into the thumbnail.
              </p>
            </div>

            {/* Prompt */}
            <div className="space-y-3">
              <Label
                htmlFor="prompt"
                className="uppercase tracking-widest text-xs font-bold text-muted-foreground"
              >
                Scene Description *
              </Label>
              <Textarea
                id="prompt"
                placeholder="e.g. A character fighting a massive ender dragon in the end dimension, dramatic lighting"
                className="min-h-[120px] rounded-none border-border bg-background focus-visible:ring-0 focus-visible:border-primary resize-none"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
                data-testid="textarea-prompt"
              />
            </div>

            {/* Style */}
            <div className="space-y-3">
              <Label
                htmlFor="style"
                className="uppercase tracking-widest text-xs font-bold text-muted-foreground"
              >
                Art Style
              </Label>
              <Select
                value={style}
                onValueChange={(val) => setStyle(val as StyleType)}
              >
                <SelectTrigger
                  className="rounded-none border-border focus:ring-0 focus:border-primary"
                  data-testid="select-style"
                >
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-border">
                  <SelectItem value="epic">Epic & Cinematic</SelectItem>
                  <SelectItem value="dramatic">Dramatic Contrast</SelectItem>
                  <SelectItem value="funny">Bright & Playful</SelectItem>
                  <SelectItem value="chill">Chill Lo-Fi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Optional fields */}
            <div className="space-y-3">
              <Label
                htmlFor="username"
                className="uppercase tracking-widest text-xs font-bold text-muted-foreground"
              >
                Minecraft Username (Optional)
              </Label>
              <Input
                id="username"
                placeholder="e.g. Dream"
                className="rounded-none border-border bg-background focus-visible:ring-0 focus-visible:border-primary"
                value={playerUsername}
                onChange={(e) => setPlayerUsername(e.target.value)}
                data-testid="input-mc-username"
              />
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="title"
                className="uppercase tracking-widest text-xs font-bold text-muted-foreground"
              >
                Video Title Overlay (Optional)
              </Label>
              <Input
                id="title"
                placeholder="e.g. I Survived 100 Days"
                className="rounded-none border-border bg-background focus-visible:ring-0 focus-visible:border-primary"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                data-testid="input-title"
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-none h-14 uppercase font-bold tracking-wider"
              disabled={generateMutation.isPending || !prompt.trim()}
              data-testid="button-generate"
            >
              {generateMutation.isPending ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Generating... {elapsed}s
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  Generate Thumbnail
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Result Area */}
        <div className="flex flex-col items-center justify-center min-h-[460px] border border-border bg-card p-6 relative overflow-hidden">
          {generateMutation.isPending && (
            <GeneratingOverlay elapsed={elapsed} />
          )}

          {!generateMutation.data &&
            !generateMutation.isPending &&
            !generateMutation.isError && (
              <div className="text-center space-y-4 text-muted-foreground opacity-40">
                <ImageIcon className="w-12 h-12 mx-auto" />
                <p className="uppercase tracking-widest text-sm">
                  Awaiting Instructions
                </p>
              </div>
            )}

          {generateMutation.isError && !generateMutation.isPending && (
            <div className="text-center space-y-4">
              <p className="uppercase tracking-widest font-bold text-destructive">
                Generation Failed
              </p>
              <p className="text-sm text-muted-foreground">
                Please try a different prompt or style.
              </p>
              <Button
                variant="outline"
                className="rounded-none"
                onClick={() => generateMutation.reset()}
              >
                Try Again
              </Button>
            </div>
          )}

          {generateMutation.data && !generateMutation.isPending && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-full space-y-6"
            >
              <div className="aspect-video relative border border-border w-full overflow-hidden bg-black">
                <img
                  src={generateMutation.data.imageUrl}
                  alt="Generated thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                    Prompt Used
                  </p>
                  <p className="text-sm italic line-clamp-2 text-muted-foreground max-w-md">
                    "{generateMutation.data.prompt}"
                  </p>
                </div>
                <Button
                  asChild
                  className="rounded-none uppercase tracking-wide shrink-0"
                >
                  <a
                    href={generateMutation.data.imageUrl}
                    download="mcview-thumbnail.png"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download HD
                  </a>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
