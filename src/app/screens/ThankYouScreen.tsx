import { useEffect, useState } from "react";
import { Camera, Mail } from "lucide-react";
import QRCode from "qrcode";

interface Props {
  onRestart: () => void;
  videoUrl?: string;
}

const buildStripDataUrl = async (
  frames: string[],
  ratio: string | undefined
): Promise<string> => {
  const frameW = 300;
  const frameH = ratio
    ? Math.round(
        frameW /
          (parseInt(ratio.split("/")[0]) / parseInt(ratio.split("/")[1]))
      )
    : 180;
  const padding = 12;
  const gap = 6;
  const headerH = 50;
  const footerH = 70;

  const canvas = document.createElement("canvas");
  canvas.width = frameW + padding * 2;
  canvas.height = headerH + padding + (frameH + gap) * 3 + footerH;

  const ctx = canvas.getContext("2d")!;

  // Cream background
  ctx.fillStyle = "#fdf8f0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Top border stripe
  ctx.fillStyle = "#e07b00";
  ctx.fillRect(0, 0, canvas.width, 6);

  // Header
  ctx.fillStyle = "#e07b00";
  ctx.font = "bold 18px serif";
  ctx.textAlign = "center";
  ctx.fillText("✦ PORTAL CONNECT ✦", canvas.width / 2, 32);

  ctx.fillStyle = "#999";
  ctx.font = "10px sans-serif";
  ctx.fillText("Heraklion, Crete", canvas.width / 2, 48);

  // Film holes on left and right
  const holeY = [headerH + padding, headerH + padding + frameH + gap, headerH + padding + (frameH + gap) * 2];
  for (const y of holeY) {
    // left holes
    ctx.fillStyle = "#e8ddd0";
    ctx.beginPath();
    ctx.roundRect(3, y + frameH / 2 - 8, 7, 16, 3);
    ctx.fill();
    // right holes
    ctx.beginPath();
    ctx.roundRect(canvas.width - 10, y + frameH / 2 - 8, 7, 16, 3);
    ctx.fill();
  }

  // Draw frames with slight shadow
  for (let i = 0; i < frames.length; i++) {
    const y = headerH + padding + i * (frameH + gap);

    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(padding + 2, y + 2, frameW, frameH);

    const img = await new Promise<HTMLImageElement>((res) => {
      const im = new Image();
      im.onload = () => res(im);
      im.src = frames[i];
    });
    ctx.drawImage(img, padding, y, frameW, frameH);

    // Frame border
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 1;
    ctx.strokeRect(padding, y, frameW, frameH);
  }

  // Footer
  const footerY = headerH + padding + (frameH + gap) * 3 + 8;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric"
  }).toUpperCase();
  const timeStr = now.toLocaleTimeString("en-GB", {
    hour: "2-digit", minute: "2-digit"
  });

  ctx.fillStyle = "#e07b00";
  ctx.font = "bold 13px serif";
  ctx.textAlign = "center";
  ctx.fillText("✦ LET'S MAKE MEMORIES ✦", canvas.width / 2, footerY + 16);

  ctx.fillStyle = "#888";
  ctx.font = "10px monospace";
  ctx.fillText(`${dateStr} · ${timeStr}`, canvas.width / 2, footerY + 32);

  // Bottom border stripe
  ctx.fillStyle = "#e07b00";
  ctx.fillRect(0, canvas.height - 6, canvas.width, 6);

  return canvas.toDataURL("image/jpeg", 0.92);
};

async function uploadStripToCloudinary(dataUrl: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", dataUrl);
  formData.append("upload_preset", "portalconnect");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dtd5ese9s/image/upload",
    { method: "POST", body: formData }
  );
  const data = await res.json();
  return data.secure_url;
}


export function ThankYouScreen({ onRestart, videoUrl }: Props) {
  const [showStrip, setShowStrip] = useState(false);
  const [frames, setFrames] = useState<string[]>([]);
  const [frameRatio, setFrameRatio] = useState<string | undefined>(undefined);
  const [frameError, setFrameError] = useState(false);
  const [stripUrl, setStripUrl] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState<string | null>(null);

  useEffect(() => {
    setFrames([]);
    setFrameError(false);
    setStripUrl(null);
    setQrDataUrl(null);

    if (!videoUrl) return;

    let cancelled = false;
    const video = document.createElement("video");
    video.src = videoUrl;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";

    const capture = async () => {
      try {
        await new Promise<void>((resolve) => {
          if (video.readyState >= 1) {
            resolve();
            return;
          }
          video.addEventListener("loadedmetadata", () => resolve(), {
            once: true,
          });
          video.load();
        });

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 320;
        canvas.height = video.videoHeight || 180;
        setFrameRatio(`${canvas.width}/${canvas.height}`);

        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Unable to create canvas context");

        const targets = [0.15, 0.5, 0.85];
        const nextFrames: string[] = [];

        for (const ratio of targets) {
          if (cancelled) return;
          const time = Math.min(
            video.duration * ratio,
            Math.max(0, video.duration - 0.1)
          );
          await new Promise<void>((resolve) => {
            const handler = () => {
              video.removeEventListener("seeked", handler);
              resolve();
            };
            video.addEventListener("seeked", handler, { once: true });
            video.currentTime = time;
          });
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          nextFrames.push(canvas.toDataURL("image/jpeg", 0.8));
        }

        if (!cancelled) setFrames(nextFrames);
      } catch (err) {
        console.warn(err);
        if (!cancelled) setFrameError(true);
      }
    };

    capture();

    return () => {
      cancelled = true;
      video.pause();
      video.src = "";
    };
  }, [videoUrl]);

  useEffect(() => {
    if (frames.length !== 3) return;

    setQrLoading(true);
    setQrError(null);

    buildStripDataUrl(frames, frameRatio).then(async (dataUrl) => {
      try {
        setStripUrl(dataUrl);
try {
  // Upload to Cloudinary and QR the returned URL
  const shareUrl = await uploadStripToCloudinary(dataUrl);
  const qr = await QRCode.toDataURL(shareUrl, {
    width: 160,
    margin: 1,
    color: { dark: "#000000", light: "#ffffff" },
    errorCorrectionLevel: "L",
  });
  setQrDataUrl(qr);
} catch (innerErr) {
  console.warn("Upload or QR failed", innerErr);
  setQrError("Could not generate shareable QR code.");
}
      } catch (err) {
        console.warn("QR generation failed", err);
        setQrError("QR generation failed. You can still download the strip below.");
      } finally {
        setQrLoading(false);
      }
    });
  }, [frames, frameRatio]);

if (showStrip) {
  return (
    <div className="h-screen bg-[var(--app-surface)] flex flex-col items-center justify-center px-8 py-6 overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-4xl h-full max-h-[90vh]">

        {/* LEFT COLUMN: Photo Strip */}
        <div
          className="flex flex-col items-center flex-shrink-0"
          style={{ background: "#fdf8f0", boxShadow: "0 8px 32px rgba(0,0,0,0.18)", height: "100%", maxHeight: "90vh", width: 260 }}
        >
          {/* Top orange stripe */}
          <div style={{ background: "#e07b00", height: 6, width: "100%", flexShrink: 0 }} />

          {/* Header */}
          <div className="w-full text-center py-2" style={{ flexShrink: 0 }}>
            <p style={{ color: "#e07b00", fontFamily: "serif", fontWeight: "bold", fontSize: 14 }}>✦ PORTAL CONNECT ✦</p>
            <p style={{ color: "#999", fontSize: 10, marginTop: 2 }}>Heraklion, Crete</p>
          </div>

          {/* Frames — fill remaining space */}
          <div className="flex flex-col w-full flex-1 overflow-hidden" style={{ gap: 5, padding: "0 12px" }}>
            {frames.length === 3
              ? frames.map((src, i) => (
                  <div key={i} className="relative flex-1 min-h-0">
                    <div style={{ position: "absolute", left: -10, top: "50%", transform: "translateY(-50%)", width: 7, height: 16, background: "#e8ddd0", borderRadius: 3 }} />
                    <div style={{ position: "absolute", right: -10, top: "50%", transform: "translateY(-50%)", width: 7, height: 16, background: "#e8ddd0", borderRadius: 3 }} />
                    <div style={{ border: "1px solid #ddd", overflow: "hidden", height: "100%", boxShadow: "2px 2px 0 rgba(0,0,0,0.08)" }}>
                      <img src={src} alt={`Frame ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  </div>
                ))
              : [1, 2, 3].map((i) => (
                  <div key={i} className="flex-1 min-h-0" style={{ background: "#e8ddd0", border: "1px solid #ddd", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#bbb", fontSize: 12 }}>Photo {i}</span>
                  </div>
                ))}
          </div>

          {/* Footer */}
          <div className="w-full text-center" style={{ padding: "8px 0 6px", flexShrink: 0 }}>
            <p style={{ color: "#e07b00", fontFamily: "serif", fontWeight: "bold", fontSize: 11 }}>✦ LET'S MAKE MEMORIES ✦</p>
            <p style={{ color: "#888", fontSize: 9, fontFamily: "monospace", marginTop: 2 }}>
              {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()} · {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>

          {/* Bottom orange stripe */}
          <div style={{ background: "#e07b00", height: 6, width: "100%", flexShrink: 0 }} />
        </div>

        {/* RIGHT COLUMN: QR + Buttons */}
        <div className="w-full max-w-sm flex flex-col gap-4 justify-center">
          <div>
            <p className="text-[var(--app-text-60)] text-xs uppercase tracking-widest mb-1">Portal Connect</p>
            <h2 className="text-[var(--app-text)]">Your Photo Strip</h2>
          </div>

          {frames.length === 3 && (
            <div className="bg-white p-6 flex flex-col items-center gap-4 shadow-md w-full">
              {qrLoading && <p className="text-xs text-gray-400">Generating QR code...</p>}
              {!qrLoading && qrDataUrl && (
                <div className="flex flex-col items-center gap-3 w-full">
                  <p className="text-xs text-gray-500 font-medium text-center">
                    {qrError ? "Scan to open on your phone" : "Scan to download your strip"}
                  </p>
                  <img src={qrDataUrl} alt="QR code" className="w-36 h-36" />
                  {qrError && <p className="text-xs text-gray-400 text-center">{qrError}</p>}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={onRestart}
              className="w-full bg-[#e07b00] hover:bg-[#c96e00] text-white py-4 font-medium transition-colors shadow-sm"
            >
              Exit to Home
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-[var(--app-bg)] flex flex-col items-center justify-center px-8 text-center">
      <div className="max-w-sm w-full">
      <h1 className="text-[#e07b00] mb-3 leading-snug">
                THANK YOU!
              </h1>

        <div className="w-20 h-20 bg-[#e07b00]/20 border border-[#e07b00]/30 flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl text-white animate-bounce">✉︎</span>
        </div>
        <h2 className="text-[var(--app-text)] mb-6 leading-snug">
  Check your <span className="font-bold text-[#e07b00]">EMAIL</span> for next steps!
</h2>

       

      
    {/*
        <div className="bg-[var(--app-surface-alt)] border border-[var(--app-border)] p-4 mb-8 text-left space-y-2">
          {[
            "Next steps and important information",
            "Your privacy controls",
            "A secure link to your invitation",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2">
              <Mail className="w-4 h-4 text-[#e07b00] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[var(--app-text-60)]">{item}</p>
            </div>
          ))}
        </div>
*/}
        
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setShowStrip(true)}
            className="w-full bg-[#e07b00] hover:bg-[#c96e00] text-white py-4 font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Camera className="w-5 h-5" />
            Get Your Complimentary Photo Strip
          </button>
          <button
            onClick={onRestart}
            className="w-full bg-[var(--app-surface-alt)] hover:bg-[var(--app-elevated)] border border-[var(--app-border)] text-[var(--app-text-60)] py-4 rounded-xl font-medium transition-colors"
          >
            Exit to Home
          </button>
        </div>

      </div>
    </div>
  );
}