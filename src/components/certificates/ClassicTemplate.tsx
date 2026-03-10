import { CertificateData } from "./types";

const ClassicTemplate = ({ data }: { data: CertificateData }) => (
  <div
    className="certificate-wrapper relative w-full max-w-[960px] aspect-[1.414/1] bg-[hsl(var(--cert-cream))] shadow-2xl overflow-hidden"
    style={{
      backgroundImage: `
        radial-gradient(ellipse at 20% 50%, hsl(var(--cert-gold) / 0.03) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 50%, hsl(var(--cert-gold) / 0.03) 0%, transparent 50%),
        url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")
      `,
    }}
  >
    <div className="absolute inset-3 border-[3px] border-[hsl(var(--cert-gold))]" />
    <div className="absolute inset-5 border border-[hsl(var(--cert-gold-light))]" />
    <div className="absolute inset-6 border border-[hsl(var(--cert-gold)/0.3)]" />

    {["top-7 left-7", "top-7 right-7 -scale-x-100", "bottom-7 left-7 -scale-y-100", "bottom-7 right-7 -scale-x-100 -scale-y-100"].map((pos, i) => (
      <svg key={i} className={`absolute ${pos} w-12 h-12 text-[hsl(var(--cert-gold))]`} viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 5 Q5 25 25 25 Q25 5 45 5" />
        <path d="M5 5 Q15 15 25 15" />
        <circle cx="8" cy="8" r="2" fill="currentColor" />
      </svg>
    ))}

    <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
      <svg viewBox="0 0 200 200" className="w-[55%] h-[55%] text-[hsl(var(--cert-navy))]" fill="currentColor">
        <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" />
        {Array.from({ length: 36 }).map((_, i) => (
          <line key={i} x1="100" y1="15" x2="100" y2="25" stroke="currentColor" strokeWidth="1" transform={`rotate(${i * 10} 100 100)`} />
        ))}
        <text x="100" y="95" textAnchor="middle" fontSize="14" fontFamily="serif">CERTIFIED</text>
        <text x="100" y="115" textAnchor="middle" fontSize="10" fontFamily="serif">★ EXCELLENCE ★</text>
      </svg>
    </div>

    <div className="relative z-10 flex flex-col items-center justify-between h-full px-12 py-10 sm:px-16 sm:py-14 md:px-20 md:py-16">
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-5 h-[1px] bg-[hsl(var(--cert-gold))]" />
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-[hsl(var(--cert-gold))]" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          <div className="w-5 h-[1px] bg-[hsl(var(--cert-gold))]" />
        </div>
        <p className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-[hsl(var(--cert-navy-light))]" style={{ fontFamily: "'Lora', serif" }}>
          {data.organization}
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl tracking-wide text-[hsl(var(--cert-navy))]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
          {data.title}
        </h1>
        <div className="flex items-center justify-center gap-3 pt-1">
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[hsl(var(--cert-gold))]" />
          <div className="w-2 h-2 rotate-45 border border-[hsl(var(--cert-gold))]" />
          <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[hsl(var(--cert-gold))]" />
        </div>
      </div>

      <div className="text-center space-y-2 flex-1 flex flex-col items-center justify-center -mt-4">
        <p className="text-xs sm:text-sm text-[hsl(var(--cert-navy-light))] italic" style={{ fontFamily: "'Lora', serif" }}>This is to certify that</p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl text-[hsl(var(--cert-navy))] py-1" style={{ fontFamily: "'Great Vibes', cursive" }}>{data.recipientName}</h2>
        <div className="w-48 sm:w-64 h-[1px] bg-[hsl(var(--cert-gold))] mx-auto" />
        <p className="text-xs sm:text-sm text-[hsl(var(--cert-navy-light))] max-w-md leading-relaxed pt-1" style={{ fontFamily: "'Lora', serif" }}>has successfully completed the requirements for</p>
        <h3 className="text-base sm:text-lg md:text-xl text-[hsl(var(--cert-navy))] font-bold tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>{data.courseName}</h3>
        <p className="text-xs sm:text-sm text-[hsl(var(--cert-navy-light))]" style={{ fontFamily: "'Lora', serif" }}>
          with distinction and honors, awarded on <span className="font-semibold">{data.date}</span>
        </p>
      </div>

      <div className="w-full">
        <div className="flex items-end justify-between px-2 sm:px-6">
          <div className="text-center w-36 sm:w-44">
            <p className="text-base sm:text-lg text-[hsl(var(--cert-navy))] italic mb-0" style={{ fontFamily: "'Great Vibes', cursive" }}>{data.signatureLeft}</p>
            <div className="w-full h-[1px] bg-[hsl(var(--cert-navy))]" />
            <p className="text-[9px] sm:text-[10px] tracking-widest uppercase text-[hsl(var(--cert-navy-light))] mt-1" style={{ fontFamily: "'Lora', serif" }}>{data.titleLeft}</p>
          </div>
          <div className="flex flex-col items-center -mb-1">
            <svg viewBox="0 0 120 120" className="w-16 h-16 sm:w-20 sm:h-20">
              {Array.from({ length: 16 }).map((_, i) => (
                <ellipse key={i} cx="60" cy="60" rx="8" ry="28" fill="hsl(38, 76%, 41%)" opacity="0.15" transform={`rotate(${i * 22.5} 60 60)`} />
              ))}
              <circle cx="60" cy="60" r="22" fill="hsl(216, 45%, 20%)" />
              <circle cx="60" cy="60" r="19" fill="none" stroke="hsl(38, 76%, 55%)" strokeWidth="1" />
              <text x="60" y="57" textAnchor="middle" fill="hsl(38, 76%, 55%)" fontSize="6" fontFamily="serif" letterSpacing="1">VERIFIED</text>
              <text x="60" y="67" textAnchor="middle" fill="hsl(38, 76%, 55%)" fontSize="5" fontFamily="serif">✦</text>
            </svg>
          </div>
          <div className="text-center w-36 sm:w-44">
            <p className="text-base sm:text-lg text-[hsl(var(--cert-navy))] italic mb-0" style={{ fontFamily: "'Great Vibes', cursive" }}>{data.signatureRight}</p>
            <div className="w-full h-[1px] bg-[hsl(var(--cert-navy))]" />
            <p className="text-[9px] sm:text-[10px] tracking-widest uppercase text-[hsl(var(--cert-navy-light))] mt-1" style={{ fontFamily: "'Lora', serif" }}>{data.titleRight}</p>
          </div>
        </div>
        <p className="text-center text-[8px] sm:text-[9px] tracking-[0.3em] text-[hsl(var(--cert-navy-light)/0.5)] mt-3 sm:mt-4" style={{ fontFamily: "'Lora', serif" }}>
          Certificate No: {data.serialNumber}
        </p>
      </div>
    </div>
  </div>
);

export default ClassicTemplate;
