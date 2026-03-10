import { CertificateData } from "./types";

const CorporateTemplate = ({ data }: { data: CertificateData }) => (
  <div className="certificate-wrapper relative w-full max-w-[960px] aspect-[1.414/1] bg-white shadow-2xl overflow-hidden">
    {/* Top bar */}
    <div className="absolute top-0 left-0 right-0 h-16 sm:h-20 bg-[hsl(220,25%,15%)]" />
    {/* Bottom bar */}
    <div className="absolute bottom-0 left-0 right-0 h-4 bg-[hsl(220,25%,15%)]" />
    {/* Accent stripe */}
    <div className="absolute top-16 sm:top-20 left-0 right-0 h-1.5 bg-gradient-to-r from-[hsl(45,80%,50%)] via-[hsl(45,90%,55%)] to-[hsl(45,80%,50%)]" />

    {/* Grid pattern background */}
    <div className="absolute inset-0 opacity-[0.015]" style={{
      backgroundImage: `
        linear-gradient(hsl(220,25%,15%) 1px, transparent 1px),
        linear-gradient(90deg, hsl(220,25%,15%) 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px'
    }} />

    {/* Content */}
    <div className="relative z-10 flex flex-col items-center justify-between h-full px-12 py-8 sm:px-16 sm:py-10 md:px-20 md:py-12">
      {/* Header - inside dark bar */}
      <div className="text-center w-full pt-1 sm:pt-2">
        <div className="flex items-center justify-center gap-3 mb-1">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded bg-[hsl(45,80%,50%)] flex items-center justify-center">
            <span className="text-[hsl(220,25%,15%)] font-black text-sm sm:text-base" style={{ fontFamily: "'Playfair Display', serif" }}>
              {data.organization.charAt(0)}
            </span>
          </div>
          <div className="text-left">
            <p className="text-xs sm:text-sm font-semibold tracking-[0.15em] uppercase text-white">
              {data.organization}
            </p>
          </div>
        </div>
      </div>

      {/* Title section */}
      <div className="text-center space-y-1 mt-4 sm:mt-6">
        <p className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[hsl(220,10%,55%)] font-medium">
          Official Document
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[hsl(220,25%,15%)] tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
          {data.title}
        </h1>
        <div className="flex items-center justify-center gap-2 pt-1">
          <div className="w-10 h-[2px] bg-[hsl(45,80%,50%)]" />
          <div className="w-1.5 h-1.5 bg-[hsl(45,80%,50%)] rotate-45" />
          <div className="w-10 h-[2px] bg-[hsl(45,80%,50%)]" />
        </div>
      </div>

      {/* Body */}
      <div className="text-center space-y-3 flex-1 flex flex-col items-center justify-center">
        <p className="text-xs sm:text-sm text-[hsl(220,10%,45%)] font-medium tracking-wide uppercase">
          Awarded to
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl text-[hsl(220,25%,15%)] py-1 border-b-2 border-[hsl(45,80%,50%)] pb-3" style={{ fontFamily: "'Great Vibes', cursive" }}>
          {data.recipientName}
        </h2>
        <p className="text-xs sm:text-sm text-[hsl(220,10%,45%)] max-w-lg leading-relaxed">
          In recognition of successful completion of the professional development program
        </p>
        <div className="bg-[hsl(220,25%,15%/0.05)] rounded px-6 py-2">
          <h3 className="text-base sm:text-lg md:text-xl text-[hsl(220,25%,15%)] font-bold tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
            {data.courseName}
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-[hsl(220,10%,55%)]">
          Issued: <span className="font-semibold text-[hsl(220,25%,15%)]">{data.date}</span>
        </p>
      </div>

      {/* Footer */}
      <div className="w-full mb-2">
        <div className="flex items-end justify-between px-2 sm:px-8">
          <div className="text-center w-36 sm:w-44">
            <p className="text-base sm:text-lg text-[hsl(220,25%,15%)]" style={{ fontFamily: "'Great Vibes', cursive" }}>{data.signatureLeft}</p>
            <div className="w-full h-[2px] bg-[hsl(220,25%,15%)]" />
            <p className="text-[9px] sm:text-[10px] tracking-widest uppercase text-[hsl(220,10%,45%)] mt-1 font-medium">{data.titleLeft}</p>
          </div>
          {/* QR-like badge */}
          <div className="flex flex-col items-center gap-1">
            <div className="grid grid-cols-4 gap-[2px] w-12 h-12 sm:w-14 sm:h-14 p-1 border border-[hsl(220,15%,85%)] rounded">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className={`rounded-[1px] ${[0,1,3,4,5,7,8,10,11,12,14,15].includes(i) ? 'bg-[hsl(220,25%,15%)]' : 'bg-transparent'}`} />
              ))}
            </div>
            <p className="text-[7px] text-[hsl(220,10%,55%)] tracking-wider">VERIFIED</p>
          </div>
          <div className="text-center w-36 sm:w-44">
            <p className="text-base sm:text-lg text-[hsl(220,25%,15%)]" style={{ fontFamily: "'Great Vibes', cursive" }}>{data.signatureRight}</p>
            <div className="w-full h-[2px] bg-[hsl(220,25%,15%)]" />
            <p className="text-[9px] sm:text-[10px] tracking-widest uppercase text-[hsl(220,10%,45%)] mt-1 font-medium">{data.titleRight}</p>
          </div>
        </div>
        <p className="text-center text-[8px] sm:text-[9px] tracking-[0.3em] text-[hsl(220,10%,65%)] mt-3">
          REF: {data.serialNumber}
        </p>
      </div>
    </div>
  </div>
);

export default CorporateTemplate;
