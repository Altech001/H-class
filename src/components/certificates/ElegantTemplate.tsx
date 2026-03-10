import { CertificateData } from "./types";

const ElegantTemplate = ({ data }: { data: CertificateData }) => (
  <div
    className="certificate-wrapper relative w-full max-w-[960px] aspect-[1.414/1] shadow-2xl overflow-hidden"
    style={{
      background: `
        linear-gradient(135deg, hsl(30, 20%, 95%) 0%, hsl(35, 25%, 92%) 50%, hsl(30, 20%, 95%) 100%)
      `,
    }}
  >
    {/* Ornate top border */}
    <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[hsl(30,50%,35%)] via-[hsl(38,76%,50%)] to-[hsl(30,50%,35%)]" />
    <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-[hsl(30,50%,35%)] via-[hsl(38,76%,50%)] to-[hsl(30,50%,35%)]" />

    {/* Thin inner border */}
    <div className="absolute inset-5 border border-[hsl(38,60%,60%/0.5)]" />
    <div className="absolute inset-7 border border-[hsl(38,60%,60%/0.25)]" />

    {/* Decorative side ribbons */}
    <div className="absolute left-5 top-5 bottom-5 w-[2px] bg-gradient-to-b from-[hsl(38,76%,50%)] via-[hsl(38,76%,50%/0.2)] to-[hsl(38,76%,50%)]" />
    <div className="absolute right-5 top-5 bottom-5 w-[2px] bg-gradient-to-b from-[hsl(38,76%,50%)] via-[hsl(38,76%,50%/0.2)] to-[hsl(38,76%,50%)]" />

    {/* Watermark */}
    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
      <div className="text-[120px] sm:text-[180px] font-bold text-[hsl(30,30%,30%)] rotate-[-20deg]" style={{ fontFamily: "'Playfair Display', serif" }}>
        CERTIFIED
      </div>
    </div>

    {/* Floral corners */}
    {["top-8 left-8", "top-8 right-8 -scale-x-100", "bottom-8 left-8 -scale-y-100", "bottom-8 right-8 -scale-x-100 -scale-y-100"].map((pos, i) => (
      <svg key={i} className={`absolute ${pos} w-16 h-16 text-[hsl(38,60%,50%/0.6)]`} viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M5 5 C5 5 10 20 20 25 C10 30 5 45 5 45" />
        <path d="M5 5 C5 5 20 10 25 20 C30 10 45 5 45 5" />
        <circle cx="10" cy="10" r="2.5" fill="currentColor" opacity="0.4" />
        <circle cx="5" cy="5" r="1.5" fill="currentColor" />
      </svg>
    ))}

    {/* Content */}
    <div className="relative z-10 flex flex-col items-center justify-between h-full px-14 py-12 sm:px-20 sm:py-16 md:px-24 md:py-18">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[hsl(38,60%,50%)]" />
          <svg viewBox="0 0 30 30" className="w-6 h-6 text-[hsl(38,60%,45%)]" fill="currentColor" opacity="0.7">
            <path d="M15 2 L18 11 L27 11 L20 17 L22 26 L15 21 L8 26 L10 17 L3 11 L12 11 Z" />
          </svg>
          <svg viewBox="0 0 30 30" className="w-4 h-4 text-[hsl(38,60%,45%)]" fill="currentColor" opacity="0.5">
            <path d="M15 2 L18 11 L27 11 L20 17 L22 26 L15 21 L8 26 L10 17 L3 11 L12 11 Z" />
          </svg>
          <svg viewBox="0 0 30 30" className="w-6 h-6 text-[hsl(38,60%,45%)]" fill="currentColor" opacity="0.7">
            <path d="M15 2 L18 11 L27 11 L20 17 L22 26 L15 21 L8 26 L10 17 L3 11 L12 11 Z" />
          </svg>
          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[hsl(38,60%,50%)]" />
        </div>
        <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[hsl(30,20%,45%)]" style={{ fontFamily: "'Lora', serif" }}>
          {data.organization}
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl italic text-[hsl(30,30%,20%)]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
          {data.title}
        </h1>
        <div className="flex items-center justify-center gap-4 pt-1">
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[hsl(38,60%,50%)] to-transparent" />
        </div>
      </div>

      {/* Body */}
      <div className="text-center space-y-2 flex-1 flex flex-col items-center justify-center -mt-4">
        <p className="text-xs sm:text-sm text-[hsl(30,15%,45%)] italic tracking-wide" style={{ fontFamily: "'Lora', serif" }}>
          This certificate is proudly presented to
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl text-[hsl(30,30%,20%)] py-2" style={{ fontFamily: "'Great Vibes', cursive" }}>
          {data.recipientName}
        </h2>
        <div className="w-56 sm:w-72 h-[1px] bg-gradient-to-r from-transparent via-[hsl(38,60%,50%)] to-transparent mx-auto" />
        <p className="text-xs sm:text-sm text-[hsl(30,15%,45%)] max-w-md leading-relaxed pt-2" style={{ fontFamily: "'Lora', serif" }}>
          in recognition of outstanding achievement in
        </p>
        <h3 className="text-base sm:text-lg md:text-xl text-[hsl(30,30%,20%)] font-semibold italic tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
          {data.courseName}
        </h3>
        <p className="text-xs sm:text-sm text-[hsl(30,15%,45%)]" style={{ fontFamily: "'Lora', serif" }}>
          Conferred on <span className="font-semibold">{data.date}</span>
        </p>
      </div>

      {/* Footer */}
      <div className="w-full">
        <div className="flex items-end justify-between px-4 sm:px-10">
          <div className="text-center w-36 sm:w-44">
            <p className="text-base sm:text-lg text-[hsl(30,30%,20%)] italic" style={{ fontFamily: "'Great Vibes', cursive" }}>{data.signatureLeft}</p>
            <div className="w-full h-[1px] bg-[hsl(30,20%,40%)]" />
            <p className="text-[9px] sm:text-[10px] tracking-widest uppercase text-[hsl(30,15%,50%)] mt-1" style={{ fontFamily: "'Lora', serif" }}>{data.titleLeft}</p>
          </div>
          {/* Elegant seal */}
          <div className="flex flex-col items-center">
            <svg viewBox="0 0 100 100" className="w-14 h-14 sm:w-18 sm:h-18">
              <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(38, 60%, 50%)" strokeWidth="1.5" opacity="0.6" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="hsl(38, 60%, 50%)" strokeWidth="0.5" opacity="0.4" />
              <circle cx="50" cy="50" r="32" fill="hsl(30, 30%, 20%)" opacity="0.9" />
              <text x="50" y="47" textAnchor="middle" fill="hsl(38, 60%, 55%)" fontSize="6" fontFamily="serif" letterSpacing="2">SEAL OF</text>
              <text x="50" y="57" textAnchor="middle" fill="hsl(38, 60%, 55%)" fontSize="5" fontFamily="serif" letterSpacing="1">EXCELLENCE</text>
            </svg>
          </div>
          <div className="text-center w-36 sm:w-44">
            <p className="text-base sm:text-lg text-[hsl(30,30%,20%)] italic" style={{ fontFamily: "'Great Vibes', cursive" }}>{data.signatureRight}</p>
            <div className="w-full h-[1px] bg-[hsl(30,20%,40%)]" />
            <p className="text-[9px] sm:text-[10px] tracking-widest uppercase text-[hsl(30,15%,50%)] mt-1" style={{ fontFamily: "'Lora', serif" }}>{data.titleRight}</p>
          </div>
        </div>
        <p className="text-center text-[8px] sm:text-[9px] tracking-[0.3em] text-[hsl(30,15%,60%)] mt-4" style={{ fontFamily: "'Lora', serif" }}>
          Certificate No: {data.serialNumber}
        </p>
      </div>
    </div>
  </div>
);

export default ElegantTemplate;
