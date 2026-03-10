import { CertificateData } from "./types";

const ModernTemplate = ({ data }: { data: CertificateData }) => (
  <div className="certificate-wrapper relative w-full max-w-[960px] aspect-[1.414/1] bg-white shadow-2xl overflow-hidden">
    {/* Geometric accent - top left */}
    <div className="absolute top-0 left-0 w-48 h-48">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[hsl(210,90%,45%)] to-[hsl(210,90%,45%/0)] opacity-10" />
      <div className="absolute top-6 left-6 w-16 h-16 border-l-4 border-t-4 border-[hsl(210,90%,45%)]" />
    </div>
    {/* Geometric accent - bottom right */}
    <div className="absolute bottom-0 right-0 w-48 h-48">
      <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-[hsl(210,90%,45%)] to-[hsl(210,90%,45%/0)] opacity-10" />
      <div className="absolute bottom-6 right-6 w-16 h-16 border-r-4 border-b-4 border-[hsl(210,90%,45%)]" />
    </div>

    {/* Side accent bar */}
    <div className="absolute left-0 top-[15%] bottom-[15%] w-2 bg-gradient-to-b from-[hsl(210,90%,45%)] via-[hsl(170,70%,45%)] to-[hsl(210,90%,45%)]" />

    {/* Content */}
    <div className="relative z-10 flex flex-col items-center justify-between h-full px-14 py-10 sm:px-20 sm:py-14 md:px-24 md:py-16">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[hsl(210,90%,45%)] flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-[hsl(210,20%,50%)] font-medium" style={{ fontFamily: "'Lora', serif" }}>
            {data.organization}
          </p>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[hsl(210,20%,15%)]" style={{ fontFamily: "'Playfair Display', serif" }}>
          {data.title}
        </h1>
        <div className="w-20 h-1 bg-gradient-to-r from-[hsl(210,90%,45%)] to-[hsl(170,70%,45%)] mx-auto rounded-full" />
      </div>

      {/* Body */}
      <div className="text-center space-y-3 flex-1 flex flex-col items-center justify-center -mt-2">
        <p className="text-xs sm:text-sm text-[hsl(210,10%,55%)] tracking-wide uppercase" style={{ fontFamily: "'Lora', serif" }}>
          Presented to
        </p>
        <h2 className="text-4xl sm:text-5xl md:text-6xl text-[hsl(210,90%,45%)] py-1" style={{ fontFamily: "'Great Vibes', cursive" }}>
          {data.recipientName}
        </h2>
        <div className="flex items-center gap-2">
          <div className="w-24 h-[2px] bg-gradient-to-r from-transparent to-[hsl(210,90%,45%/0.4)]" />
          <div className="w-2 h-2 rounded-full bg-[hsl(210,90%,45%)]" />
          <div className="w-24 h-[2px] bg-gradient-to-l from-transparent to-[hsl(210,90%,45%/0.4)]" />
        </div>
        <p className="text-xs sm:text-sm text-[hsl(210,10%,45%)] max-w-lg leading-relaxed" style={{ fontFamily: "'Lora', serif" }}>
          For successfully completing
        </p>
        <h3 className="text-lg sm:text-xl md:text-2xl text-[hsl(210,20%,15%)] font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
          {data.courseName}
        </h3>
        <p className="text-xs sm:text-sm text-[hsl(210,10%,55%)]" style={{ fontFamily: "'Lora', serif" }}>
          {data.date}
        </p>
      </div>

      {/* Footer */}
      <div className="w-full">
        <div className="flex items-end justify-between px-4 sm:px-8">
          <div className="text-center w-36 sm:w-44">
            <p className="text-base sm:text-lg text-[hsl(210,20%,15%)] italic" style={{ fontFamily: "'Great Vibes', cursive" }}>{data.signatureLeft}</p>
            <div className="w-full h-[2px] bg-[hsl(210,90%,45%)]" />
            <p className="text-[9px] sm:text-[10px] tracking-widest uppercase text-[hsl(210,10%,55%)] mt-1 font-medium">{data.titleLeft}</p>
          </div>
          <div className="text-center w-36 sm:w-44">
            <p className="text-base sm:text-lg text-[hsl(210,20%,15%)] italic" style={{ fontFamily: "'Great Vibes', cursive" }}>{data.signatureRight}</p>
            <div className="w-full h-[2px] bg-[hsl(210,90%,45%)]" />
            <p className="text-[9px] sm:text-[10px] tracking-widest uppercase text-[hsl(210,10%,55%)] mt-1 font-medium">{data.titleRight}</p>
          </div>
        </div>
        <p className="text-center text-[8px] sm:text-[9px] tracking-[0.3em] text-[hsl(210,10%,70%)] mt-4">
          ID: {data.serialNumber}
        </p>
      </div>
    </div>
  </div>
);

export default ModernTemplate;
