import { useState, useRef, useEffect, useCallback } from "react";
import { useGetMinecraftPlayer, getGetMinecraftPlayerQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Search, Download, AlertTriangle, RotateCcw } from "lucide-react";

type PoseType =
  | "idle"
  | "walking"
  | "running"
  | "flying"
  | "crouching"
  | "swimming"
  | "waving"
  | "hit"
  | "running_hit"
  | "static";

const POSES: { type: PoseType; label: string }[] = [
  { type: "idle", label: "Idle" },
  { type: "walking", label: "Walking" },
  { type: "running", label: "Running" },
  { type: "flying", label: "Flying" },
  { type: "crouching", label: "Crouch" },
  { type: "swimming", label: "Swim" },
  { type: "waving", label: "Wave" },
  { type: "hit", label: "Hit" },
  { type: "running_hit", label: "Run+Hit" },
  { type: "static", label: "Static" },
];

function applyAnimation(viewer: any, skinview3d: any, pose: PoseType) {
  switch (pose) {
    case "walking":
      viewer.animation = new skinview3d.WalkingAnimation();
      break;
    case "running":
      viewer.animation = new skinview3d.RunningAnimation();
      break;
    case "flying":
      viewer.animation = new skinview3d.FlyingAnimation();
      break;
    case "crouching":
      viewer.animation = new skinview3d.CrouchAnimation();
      break;
    case "swimming":
      viewer.animation = new skinview3d.SwimAnimation();
      break;
    case "waving":
      viewer.animation = new skinview3d.WaveAnimation();
      break;
    case "hit":
      viewer.animation = new skinview3d.HitAnimation();
      break;
    case "running_hit":
      viewer.animation = new skinview3d.RunningHitAnimation();
      break;
    case "idle":
      viewer.animation = new skinview3d.IdleAnimation();
      break;
    case "static":
    default:
      viewer.animation = null;
      break;
  }
}

function SkinViewer3D({
  skinBlobUrl,
  pose,
}: {
  skinBlobUrl: string;
  pose: PoseType;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<any>(null);
  const skinview3dRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  // Init once when skinBlobUrl becomes available
  useEffect(() => {
    if (!canvasRef.current || !skinBlobUrl) return;
    let cancelled = false;

    async function init() {
      try {
        const skinview3d = await import("skinview3d");
        if (cancelled || !canvasRef.current) return;

        if (viewerRef.current) {
          try { viewerRef.current.dispose(); } catch { /* ignore */ }
        }

        const viewer = new skinview3d.SkinViewer({
          canvas: canvasRef.current,
          width: 380,
          height: 480,
          skin: skinBlobUrl,
        });

        viewer.controls.enableRotate = true;
        viewer.controls.enableZoom = true;
        viewer.controls.enablePan = false;
        viewer.renderer.setClearColor(0x000000, 0);
        viewer.camera.position.set(20, 15, 60);
        viewer.camera.lookAt(0, 0, 0);

        applyAnimation(viewer, skinview3d, pose);

        if (!cancelled) {
          viewerRef.current = viewer;
          skinview3dRef.current = skinview3d;
          setReady(true);
        } else {
          viewer.dispose();
        }
      } catch (err) {
        console.error("skinview3d error:", err);
      }
    }

    init();

    return () => {
      cancelled = true;
      setReady(false);
      if (viewerRef.current) {
        try { viewerRef.current.dispose(); } catch { /* ignore */ }
        viewerRef.current = null;
        skinview3dRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skinBlobUrl]);

  // Switch animation without re-creating the viewer
  useEffect(() => {
    if (!viewerRef.current || !skinview3dRef.current || !ready) return;
    applyAnimation(viewerRef.current, skinview3dRef.current, pose);
  }, [pose, ready]);

  return (
    <div className="relative">
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="w-full h-full rounded-none bg-border/50" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={380}
        height={480}
        className="cursor-grab active:cursor-grabbing block"
        style={{ opacity: ready ? 1 : 0, transition: "opacity 0.3s" }}
      />
    </div>
  );
}

export default function SkinRenderer() {
  const [searchInput, setSearchInput] = useState("");
  const [username, setUsername] = useState("");
  const [skinBlobUrl, setSkinBlobUrl] = useState<string | null>(null);
  const [activePose, setActivePose] = useState<PoseType>("idle");

  const {
    data: player,
    isLoading,
    isError,
    error,
  } = useGetMinecraftPlayer(username, {
    query: {
      enabled: !!username,
      queryKey: getGetMinecraftPlayerQueryKey(username),
      retry: false,
    },
  });

  useEffect(() => {
    if (!player?.skinUrl) {
      setSkinBlobUrl(null);
      return;
    }

    let objectUrl: string | null = null;

    fetch(player.skinUrl)
      .then((r) => r.blob())
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setSkinBlobUrl(objectUrl);
      })
      .catch((err) => console.error("Failed to fetch skin blob:", err));

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [player?.skinUrl]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = searchInput.trim();
      if (trimmed) {
        setSkinBlobUrl(null);
        setActivePose("idle");
        setUsername(trimmed);
      }
    },
    [searchInput]
  );

  const handleDownloadSkin = useCallback(async () => {
    if (!player?.skinUrl) return;
    try {
      const response = await fetch(player.skinUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${player.username}-skin.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download skin", err);
    }
  }, [player]);

  const handleReset = useCallback(() => {
    setSkinBlobUrl(null);
    setUsername("");
    setSearchInput("");
    setActivePose("idle");
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-2 mb-12">
        <h1 className="text-3xl font-bold uppercase tracking-tight">
          Skin Renderer
        </h1>
        <p className="text-muted-foreground font-light">
          Interactive 3D posing and high-resolution skin extraction. Drag to
          rotate, scroll to zoom.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 max-w-md mb-12">
        <Input
          placeholder="Minecraft Username"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="rounded-none border-border bg-background focus-visible:ring-0 focus-visible:border-primary text-lg h-12"
          data-testid="input-username"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <Button
          type="submit"
          size="lg"
          className="rounded-none h-12 px-8 uppercase font-bold tracking-wider"
          disabled={isLoading}
          data-testid="button-render"
        >
          <Search className="w-5 h-5 mr-2" />
          Render
        </Button>
        {username && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="rounded-none h-12 px-4"
            onClick={handleReset}
            title="Clear"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}
      </form>

      {isLoading && (
        <div className="grid md:grid-cols-[400px_1fr] gap-12">
          <Skeleton className="h-[480px] rounded-none bg-border/50" />
          <div className="space-y-8">
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-none bg-border/50" />
              ))}
            </div>
          </div>
        </div>
      )}

      {isError && (
        <div className="p-8 border border-destructive/50 bg-destructive/10 flex flex-col items-center justify-center text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-destructive" />
          <h3 className="text-xl font-bold uppercase">Player Not Found</h3>
          <p className="text-muted-foreground">
            {(error as any)?.data?.error ??
              `Could not find "${username}". Check the spelling and try again.`}
          </p>
          <Button variant="outline" className="rounded-none" onClick={handleReset}>
            Try Again
          </Button>
        </div>
      )}

      {!isLoading && !isError && !player && (
        <div className="h-64 border border-dashed border-border flex items-center justify-center text-muted-foreground">
          <span className="uppercase tracking-widest text-sm">
            Enter a username to begin rendering
          </span>
        </div>
      )}

      {player && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-16"
        >
          {/* Main layout: 3D viewer left, info + static assets right */}
          <div className="grid md:grid-cols-[420px_1fr] gap-12 items-start">
            {/* 3D Viewer + Pose Picker */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="text-sm font-bold uppercase tracking-widest">
                  3D Viewer — {player.username}
                </h2>
                <span className="text-xs text-muted-foreground/50 uppercase tracking-widest">
                  drag · scroll
                </span>
              </div>

              <div className="border border-border bg-card/20 flex items-center justify-center overflow-hidden">
                {skinBlobUrl ? (
                  <SkinViewer3D skinBlobUrl={skinBlobUrl} pose={activePose} />
                ) : (
                  <Skeleton className="w-[380px] h-[480px] rounded-none bg-border/50" />
                )}
              </div>

              {/* Pose buttons */}
              <div className="grid grid-cols-5 gap-1">
                {POSES.map((p) => (
                  <button
                    key={p.type}
                    onClick={() => setActivePose(p.type)}
                    className={`py-2 px-1 text-xs uppercase tracking-wider font-bold border transition-colors ${
                      activePose === p.type
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Static renders + download */}
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="text-sm font-bold uppercase tracking-widest">
                  Static Assets
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-none text-xs uppercase tracking-wide"
                  onClick={handleDownloadSkin}
                >
                  <Download className="w-3 h-3 mr-2" />
                  Download Skin File
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-6 bg-card border border-border space-y-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Avatar
                  </span>
                  <img
                    src={player.avatarUrl}
                    alt="Avatar"
                    className="w-24 h-24 object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
                <div className="flex flex-col items-center p-6 bg-card border border-border space-y-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Face
                  </span>
                  <img
                    src={player.faceUrl}
                    alt="Face"
                    className="w-24 h-24 object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
                <div className="flex flex-col items-center p-6 bg-card border border-border space-y-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Body
                  </span>
                  <img
                    src={player.bodyUrl}
                    alt="Body"
                    className="h-40 object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
              </div>

              {/* Skin texture preview */}
              <div className="border border-border bg-card p-6 space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground block">
                  Raw Skin Texture
                </span>
                <div className="flex items-start gap-6">
                  <img
                    src={player.skinUrl}
                    alt="Skin texture"
                    className="w-32 h-32 object-contain border border-border"
                    style={{ imageRendering: "pixelated" }}
                  />
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="text-xs">
                      <span className="font-bold uppercase tracking-wider text-foreground">UUID</span>
                      <br />
                      <span className="font-mono text-xs break-all">{player.uuid}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
