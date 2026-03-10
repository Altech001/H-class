import { Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CertificateData, TemplateType } from "@/components/certificates/types";
import ClassicTemplate from "@/components/certificates/ClassicTemplate";
import ModernTemplate from "@/components/certificates/ModernTemplate";
import ElegantTemplate from "@/components/certificates/ElegantTemplate";
import CorporateTemplate from "@/components/certificates/CorporateTemplate";

const sampleData: CertificateData = {
  recipientName: "Altech Albert",
  courseName: "Advanced Leadership & Strategic Management",
  organization: "International Academy of Excellence",
  date: "March 7, 2026",
  title: "Certificate of Achievement",
  signatureLeft: "Dr. James Wilson",
  titleLeft: "Program Director",
  signatureRight: "Prof. Sarah Chen",
  titleRight: "Chief Executive Officer",
  serialNumber: "IAE-2026-00847-ACH",
};

const templates: { id: TemplateType; label: string; description: string; accent: string }[] = [
  { id: "classic", label: "Classic", description: "Ornate gold & navy with flourishes", accent: "bg-[hsl(38,76%,41%)]" },
  { id: "modern", label: "Modern", description: "Clean geometric with blue accents", accent: "bg-[hsl(210,90%,45%)]" },
  { id: "elegant", label: "Elegant", description: "Warm tones with refined typography", accent: "bg-[hsl(30,50%,35%)]" },
  { id: "corporate", label: "Corporate", description: "Professional dark header style", accent: "bg-[hsl(220,25%,15%)]" },
];

const Index = () => {
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>("classic");

  const handlePrint = () => window.print();

  const renderTemplate = () => {
    switch (activeTemplate) {
      case "classic": return <ClassicTemplate data={sampleData} />;
      case "modern": return <ModernTemplate data={sampleData} />;
      case "elegant": return <ElegantTemplate data={sampleData} />;
      case "corporate": return <CorporateTemplate data={sampleData} />;
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row items-start justify-center py-10 px-6 gap-10">
      {/* Left Column: Detailed Certificate Viewer */}
      <div className="flex-1 flex flex-col items-center min-w-0">
        <div className="w-full bg-slate-50/80 rounded-none p-6 sm:p-12 md:p-16 border border-slate-200/40 flex items-center justify-center min-h-[500px] lg:min-h-[720px] relative overflow-hidden">
          {/* Subtle desk-like grid background */}

          <div className="relative group w-full max-w-[820px] transition-all duration-700 hover:scale-[1.002]">
            {/* The actual certificate "paper" frame */}
            <div className="relative shadow-[0_35px_80px_rgba(15,23,42,0.15)] ring-1 ring-slate-900/5 overflow-hidden bg-white aspect-[1.414/1]">
              <div className="w-full h-full transform-gpu rounded-none overflow-auto scrollbar-hide">
                {renderTemplate()}
              </div>
            </div>

            {/* Physical context element */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 no-print">
              {/* <div className="h-1.5 w-16 bg-slate-200/40 rounded-full blur-[1px]" /> */}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Template selector */}
      <div className="no-print w-full md:w-64 shrink-0 pt-1">
        <h2 className="text-[10px] font-bold text-muted-foreground mb-4 tracking-widest uppercase">Choose Template</h2>
        <div className="flex flex-col gap-3">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTemplate(t.id)}
              className={`group relative text-left p-4 rounded-xl border-2 transition-all duration-300 ${activeTemplate === t.id
                ? "border-foreground bg-background shadow-lg scale-[1.02]"
                : "border-border bg-background/60 hover:border-foreground/30 hover:bg-background"
                }`}
            >
              <div className="flex items-center gap-3 mb-1.5">
                <div className={`w-3.5 h-3.5 rounded-full shadow-sm ${t.accent}`} />
                <span className="text-sm font-bold text-foreground">{t.label}</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">{t.description}</p>
              {activeTemplate === t.id && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-foreground flex items-center justify-center animate-in zoom-in-50">
                  <svg viewBox="0 0 24 24" className="w-3 h-3 text-background" fill="none" stroke="currentColor" strokeWidth="3.5">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
        <div className="mt-10 no-print flex gap-3 mb-8 w-full justify-center">
          <Button onClick={handlePrint} className="gap-2 bg-blue-800 rounded px-6">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>

      </div>

    </div>
  );
};

export default Index;