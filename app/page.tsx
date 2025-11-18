"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";
import html2canvas from "html2canvas";

type Theme = "belle" | "barbie" | "audrey";

type CrownPos = { x: number; y: number };

const SPARKLES = [
  { top: "8%", left: "8%", duration: "16s", delay: "0s" },
  { top: "18%", left: "70%", duration: "18s", delay: "2s" },
  { top: "30%", left: "20%", duration: "20s", delay: "4s" },
  { top: "40%", left: "85%", duration: "19s", delay: "1s" },
  { top: "55%", left: "10%", duration: "21s", delay: "3s" },
  { top: "65%", left: "60%", duration: "17s", delay: "5s" },
  { top: "75%", left: "30%", duration: "22s", delay: "6s" },
  { top: "88%", left: "80%", duration: "19s", delay: "7s" },
];

export default function Home() {
  const [unlocked, setUnlocked] = useState(false);
  const [secretInput, setSecretInput] = useState("");
  const [theme, setTheme] = useState<Theme>("belle");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isCrowned, setIsCrowned] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);
  const [placementMode, setPlacementMode] = useState(false);

  const [crownPos, setCrownPos] = useState<CrownPos>({ x: 50, y: 10 });
  const [crownSize, setCrownSize] = useState<number>(40); // px
  const [isDragging, setIsDragging] = useState(false);

  const photoAreaRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const certificateRef = useRef<HTMLDivElement | null>(null);

  const handleUnlock = () => {
    if (secretInput.trim().toLowerCase() === "edil") {
      setUnlocked(true);
    } else {
      alert("Try again, my princess 💗");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setIsCrowned(false);
    setIsPlacing(false);
    setPlacementMode(false);
    setCrownPos({ x: 50, y: 10 });
    setCrownSize(40);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleStartPlacement = () => {
    if (!imagePreview) {
      alert("Upload your royal portrait first 💌");
      return;
    }
    setPlacementMode(true);
    setIsCrowned(false);
    setIsPlacing(false);
    alert("Now tap on your head in the photo to place the crown ✨");
  };

  const handleImageClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!placementMode || !imagePreview) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let xPercent = (x / rect.width) * 100;
    let yPercent = (y / rect.height) * 100;

    xPercent = Math.min(90, Math.max(10, xPercent));
    yPercent = Math.min(90, Math.max(5, yPercent));

    // move slightly up so crown is above the tap point
    yPercent = yPercent - 5;

    setCrownPos({ x: xPercent, y: yPercent });

    // crown size scales with image height (no distortion)
    const sizePx = Math.max(30, Math.min(90, rect.height * 0.16));
    setCrownSize(sizePx);

    setPlacementMode(false);
    animateCrown();
  };

  const animateCrown = () => {
    setIsPlacing(true);
    setIsCrowned(false);
    setTimeout(() => {
      setIsPlacing(false);
      setIsCrowned(true);
    }, 650);
  };

  // Drag support (mouse + touch) for fine-tuning crown position

  const startDrag = (
    e: ReactMouseEvent<HTMLSpanElement> | ReactTouchEvent<HTMLSpanElement>
  ) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isCrowned) return;
    setIsDragging(true);
  };

  const endDrag = () => {
    setIsDragging(false);
  };

  const handleDragMove = (
    e: ReactMouseEvent<HTMLDivElement> | ReactTouchEvent<HTMLDivElement>
  ) => {
    if (!isDragging || !photoAreaRef.current || !imagePreview) return;

    const rect = photoAreaRef.current.getBoundingClientRect();

    let clientX: number;
    let clientY: number;

    if ("touches" in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    let xPercent = (x / rect.width) * 100;
    let yPercent = (y / rect.height) * 100;

    xPercent = Math.min(90, Math.max(10, xPercent));
    yPercent = Math.min(90, Math.max(5, yPercent));

    yPercent = yPercent - 5;

    setCrownPos({ x: xPercent, y: yPercent });
  };

  const handleDownloadCertificate = async () => {
    if (!certificateRef.current) return;

    const canvas = await html2canvas(certificateRef.current, {
      backgroundColor: "#ffe6f0",
      scale: 2,
    });

    const link = document.createElement("a");
    link.download = "princess-certificate.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // ----- THEME HELPERS -----

  const themeLabel = (t: Theme) => {
    if (t === "belle") return "Belle mode";
    if (t === "barbie") return "Barbie pink";
    return "Audrey at Tiffany’s";
  };

  const themeBackgroundStyle = (): CSSProperties => {
    if (theme === "belle") {
      return {
        backgroundImage:
          'linear-gradient(rgba(255, 246, 210, 0.65), rgba(255, 220, 190, 0.70)), url("/belle-bg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      };
    }
    if (theme === "barbie") {
      return {
        backgroundImage:
          'linear-gradient(rgba(255, 215, 239, 0.60), rgba(255, 165, 214, 0.70)), url("/barbie-bg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      };
    }
    return {
      backgroundImage:
        'linear-gradient(rgba(213, 244, 247, 0.55), rgba(178, 223, 229, 0.65)), url("/audrey-bg.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center center",
      backgroundRepeat: "no-repeat",
    };
  };

  const themeHeaderText = () => {
    switch (theme) {
      case "belle":
        return "text-[#b07a1f]";
      case "barbie":
        return "text-[#c72d7b]";
      case "audrey":
      default:
        return "text-[#1b6f7d]";
    }
  };

  const themeAccent = () => {
    switch (theme) {
      case "belle":
        return "bg-[#ffe9ba] border-[#f6d365]";
      case "barbie":
        return "bg-[#ffc3ea] border-[#ff84c8]";
      case "audrey":
      default:
        return "bg-[#d4f3f6] border-[#4bb5c6]";
    }
  };

  // 🔐 Secret word gate
  if (!unlocked) {
    return (
      <div className="min-h-screen diary-bg flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white/80 border border-pink-200 rounded-3xl shadow-diary px-6 py-7">
          <div className="text-center mb-5">
            <p className="text-xs tracking-wide text-pink-500 mb-1">
              Princess Lock
            </p>
            <h1 className="text-2xl font-bold text-diaryText mb-2">
              Secret Word Needed
            </h1>
            <p className="text-sm text-pink-600">
              Type the name of the one who made this for you.
            </p>
          </div>

          <input
            type="password"
            value={secretInput}
            onChange={(e) => setSecretInput(e.target.value)}
            placeholder="Enter secret word"
            className="w-full rounded-full border border-pink-300 bg-white/70 px-4 py-3 text-center text-sm text-diaryText mb-4 outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-300"
          />

          <button
            onClick={handleUnlock}
            className="w-full ribbon-btn ribbon-btn-primary mb-2"
          >
            Unlock diary
          </button>

          <p className="text-[11px] text-center text-pink-500 mt-1">
            Hint: it&apos;s only four letters long.
          </p>
        </div>
      </div>
    );
  }

  // 🌸 Main UI
  return (
    <div
      className="min-h-screen flex justify-center px-4 py-8 diary-bg relative overflow-hidden"
      style={themeBackgroundStyle()}
      onMouseMove={handleDragMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onTouchMove={handleDragMove}
      onTouchEnd={endDrag}
    >
      {/* Floating sparkles */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {SPARKLES.map((s, i) => (
          <span
            key={i}
            className="sparkle-dot"
            style={
              {
                top: s.top,
                left: s.left,
                "--sparkle-duration": s.duration,
                "--sparkle-delay": s.delay,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-sm rounded-3xl shadow-diary px-6 py-7 flex flex-col items-stretch border border-white/60 bg-white/40 backdrop-blur-md">
        {/* Header */}
        <header className="text-center mb-5">
          <h1
            className={`text-3xl font-bold leading-tight ${themeHeaderText()}`}
          >
            Princess
            <br />
            Crown Diary
          </h1>
          <p className="text-xs mt-2 text-pink-600">
            for my princess in Dhaka • Nov 18
          </p>
        </header>

        {/* Photo area */}
        <section
          ref={photoAreaRef}
          className="relative rounded-3xl border-2 border-pink-200 bg-[#ffeef6] px-3 pt-5 pb-4 mb-5 overflow-hidden"
        >
          {/* tape */}
          <div className="absolute -top-2 left-6 h-5 w-20 bg-[#ffe8f1] border border-pink-200 rounded-full rotate-[-6deg] opacity-90" />
          <div className="absolute -top-1 right-7 h-5 w-16 bg-[#ffe8f1] border border-pink-200 rounded-full rotate-[5deg] opacity-90" />

          <div
            className={`relative mt-3 rounded-2xl bg-[#fff7fb] border border-pink-200 flex items-center justify-center overflow-hidden ${
              isCrowned ? "glitter-frame" : ""
            }`}
            style={{ minHeight: 220 }}
            onClick={handleImageClick}
          >
            {imagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagePreview}
                alt="Uploaded portrait"
                className="w-full h-auto object-contain bg-[#fff7fb]"
              />
            ) : (
              <div className="text-center text-sm text-pink-500 px-4 py-6">
                <p className="mb-1 font-medium">Upload your royal portrait</p>
                <p className="text-[11px]">
                  A selfie, a cute photo or any picture you love.
                </p>
              </div>
            )}

            {/* crown */}
            {(isPlacing || isCrowned) && (
              <div
                className="absolute"
                style={{
                  left: `${crownPos.x}%`,
                  top: `${crownPos.y}%`,
                  transform: "translate(-50%, -60%)",
                }}
              >
                <span
                  className={`inline-block crown-draggable ${
                    isPlacing ? "crown-drop" : "crown-glitter"
                  }`}
                  style={{ fontSize: `${crownSize}px` }}
                  onMouseDown={startDrag}
                  onTouchStart={startDrag}
                >
                  👑
                </span>
              </div>
            )}
          </div>

          {placementMode && (
            <p className="mt-2 text-[11px] text-center text-pink-600">
              Tap on your head in the picture to place your crown ✨
            </p>
          )}
        </section>

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Buttons */}
        <div className="space-y-3 mb-4">
          <button
            type="button"
            onClick={triggerUpload}
            className={`w-full ribbon-btn ${themeAccent()}`}
          >
            Upload photo
          </button>

          <button
            type="button"
            onClick={handleStartPlacement}
            className="w-full ribbon-btn ribbon-btn-primary flex items-center justify-center gap-1"
          >
            <span>Tap to place the crown</span>
          </button>
        </div>

        {/* Message */}
        {isCrowned && (
          <div className="mb-4 text-center text-xs text-pink-700">
            Happy Princess Day, my princess. 💌
          </div>
        )}

        {/* Theme selector */}
        <div className="mb-4">
          <p className="text-[11px] text-center text-pink-600 mb-2 tracking-wide uppercase">
            Theme
          </p>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => setTheme("belle")}
              className={`theme-pill ${
                theme === "belle" ? "theme-pill-active" : ""
              }`}
            >
              Belle
            </button>
            <button
              type="button"
              onClick={() => setTheme("barbie")}
              className={`theme-pill ${
                theme === "barbie" ? "theme-pill-active" : ""
              }`}
            >
              Barbie
            </button>
            <button
              type="button"
              onClick={() => setTheme("audrey")}
              className={`theme-pill ${
                theme === "audrey" ? "theme-pill-active" : ""
              }`}
            >
              Audrey
            </button>
          </div>
          <p className="text-[10px] text-center text-pink-500 mt-2">
            Currently: {themeLabel(theme)}
          </p>
        </div>

        {/* Princess certificate */}
        {isCrowned && (
          <section
            ref={certificateRef}
            className="mb-4 rounded-3xl border border-pink-200 bg-[#fff5fb]/90 px-4 py-4 text-center shadow-sm"
          >
            <p className="text-[11px] tracking-wide text-pink-600 uppercase mb-1">
              Princess Certificate
            </p>
            <p className="text-xs text-pink-700 mb-3">
              This certifies that{" "}
              <span className="font-semibold text-pink-800">you</span> are officially crowned
              the princess of Edil&apos;s heart.
            </p>
            <div className="rounded-2xl border border-pink-200 overflow-hidden mb-3">
              {imagePreview && (
                <div className="relative w-full bg-[#fff7fb]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Crowned portrait"
                    className="w-full h-auto object-contain"
                  />
                  <div
                    className="absolute"
                    style={{
                      left: `${crownPos.x}%`,
                      top: `${crownPos.y}%`,
                      transform: "translate(-50%, -60%)",
                    }}
                  >
                    <span
                      className="inline-block crown-glitter"
                      style={{ fontSize: `${crownSize * 0.7}px` }}
                    >
                      👑
                    </span>
                  </div>
                </div>
              )}
            </div>
            <p className="text-[10px] text-pink-500">
              Signed with love,{" "}
              <span className="font-semibold text-pink-800">Edil</span>.
            </p>
          </section>
        )}

        {/* Footer */}
        <div className="mt-auto flex flex-col items-center gap-1 pt-2 border-t border-pink-100">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-1">
            {isCrowned && (
              <button
                type="button"
                onClick={handleDownloadCertificate}
                className="text-[11px] underline text-pink-600 hover:text-pink-700"
              >
                Download princess certificate
              </button>
            )}
          </div>
          <p className="text-[10px] text-pink-400">
            This page belongs to: <span className="font-semibold">you</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
