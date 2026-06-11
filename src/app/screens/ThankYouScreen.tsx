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
  const frameW = 320;
  const frameH = ratio
    ? Math.round(
        frameW /
          (parseInt(ratio.split("/")[0]) / parseInt(ratio.split("/")[1]))
      )
    : 180;
  const padding = 16;
  const gap = 8;
  const footerH = 40;

  const canvas = document.createElement("canvas");
  canvas.width = frameW + padding * 2;
  canvas.height = padding + (frameH + gap) * 3 + footerH + padding;

  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < frames.length; i++) {
    const img = await new Promise<HTMLImageElement>((res) => {
      const im = new Image();
      im.onload = () => res(im);
      im.src = frames[i];
    });
    ctx.drawImage(img, padding, padding + i * (frameH + gap), frameW, frameH);
  }

  ctx.fillStyle = "#999999";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(
    "Portal Connect - Heraklion, Crete",
    canvas.width / 2,
    canvas.height - 12
  );

  return canvas.toDataURL("image/jpeg", 0.9);
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
    <div className="min-h-screen bg-[var(--app-surface)] flex flex-col items-center justify-center px-8 py-6 text-center">
      {/* 1. Header (Stays Centered at the top) */}

      {/* 2. Main Container (Splits into 2 Columns side-by-side) */}
      <div className="flex flex-col md:flex-row items-start justify-center gap-8 w-full max-w-4xl text-left">
        
        {/* LEFT COLUMN: The Photo Strip (Maintains exact width/styles) */}
        <div className="w-full max-w-xs flex-shrink-0 bg-white p-4 shadow-2xl flex flex-col items-center gap-3">
          {frames.length === 3
            ? frames.map((src, i) => (
                <div
                  key={i}
                  style={frameRatio ? { aspectRatio: frameRatio } : undefined}
                  className="w-full overflow-hidden bg-gray-200"
                >
                  <img
                    src={src}
                    alt={`Photo strip frame ${i + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))
            : [1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={
                    frameRatio ? { aspectRatio: frameRatio } : { height: 112 }
                  }
                  className="w-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm"
                >
                  Photo {i}
                </div>
              ))}

          <div className="mt-2 text-center">
            <p className="text-xs text-gray-400">Portal Connect</p>
            <p className="text-xs text-gray-300">Heraklion, Crete</p>
          </div>

          {videoUrl && frames.length === 0 && !frameError && (
            <p className="text-[var(--app-text-60)] text-xs text-center">
              Generating your photo strip...
            </p>
          )}

          {frameError && (
            <p className="text-red-600 text-xs text-center">
              Unable to generate photo strip from the recording.
            </p>
          )}
        </div>

        {/* RIGHT COLUMN: QR Code & Call to Action Buttons */}
        <div className="w-full max-w-sm flex flex-col gap-4 self-center md:self-stretch justify-center">
                <div className="w-full max-w-4xl mb-6">
        <p className="text-[var(--app-text-60)] text-xs uppercase tracking-widest mb-2">
          Portal Connect
        </p>
        <h2 className="text-[var(--app-text)]">Your Photo Strip</h2>
      </div>
          {frames.length === 3 && (
            <div className="bg-white p-6 flex flex-col items-center gap-4 shadow-md w-full">
              {qrLoading && (
                <p className="text-xs text-gray-400">Generating QR code...</p>
              )}
              {!qrLoading && qrDataUrl && stripUrl && (
                <div className="flex flex-col items-center gap-4 w-full">
                  <p className="text-xs text-gray-500 font-medium text-center">
                    {qrError ? "Scan this code to open the page on your phone" : "Scan to download your strip"}
                  </p>
                  <img
                    src={qrDataUrl}
                    alt="QR code to download photo strip"
                    className="w-36 h-36"
                  />
                  {qrError && (
                    <p className="text-xs text-gray-400 leading-tight text-center">
                      {qrError}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons arranged cleanly beneath the QR status wrapper */}
          <div className="flex flex-col gap-3 w-full">
            {/*{stripUrl && (
              <a
                href={stripUrl}
                download="portal-connect-strip.jpg"
                className="w-full bg-[#e07b00] hover:bg-[#c96e00] text-white py-4 text-sm font-medium text-center transition-colors block shadow-sm"
              >
                Download Photo Strip
              </a>
            )}
              */}
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