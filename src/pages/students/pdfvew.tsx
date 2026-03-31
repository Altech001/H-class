import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
    RotateCw,
    Download,
    Maximize2,
    Minimize2,
    ArrowLeft,
    FileText,
    Search,
    Printer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFView() {
    const navigate = useNavigate();
    const location = useLocation();
    const { pdfUrl, title } = location.state || {
        pdfUrl: "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf",
        title: "Course Document"
    };

    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [rotation, setRotation] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setIsLoaded(true);
    }

    const changePage = (offset: number) => {
        setPageNumber(prevPageNumber => {
            const newPage = prevPageNumber + offset;
            return Math.min(Math.max(1, newPage), numPages || 1);
        });
    };

    const zoom = (delta: number) => {
        setScale(prevScale => Math.min(Math.max(0.5, prevScale + delta), 3.0));
    };

    const rotate = () => {
        setRotation(prev => (prev + 90) % 360);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    return (
        <div className={`flex flex-col bg-[#f0f2f5] min-h-screen animate-in fade-in duration-500 ${isFullscreen ? 'fixed inset-0 z-10' : 'relative'}`}>
            {/* Premium Toolbar */}
            <div className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => navigate(-1)}
                        className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 border rounded text-[10px] font-black text-slate-600 shrink-0 hover:bg-transparent"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Close</span>
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-rose-50 rounded">
                            <FileText className="w-4 h-4 text-rose-600" />
                        </div>
                        <h1 className="text-sm font-bold text-slate-800 line-clamp-1 max-w-[200px] md:max-w-md">
                            {title}
                        </h1>
                    </div>
                </div>

                {/* Dynamic Controls */}
                <div className="flex items-center gap-1 md:gap-2">
                    <div className="hidden md:flex items-center bg-slate-100 rounded p-1 mr-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-600 rounded-sm"
                            onClick={() => zoom(-0.1)}
                            disabled={!isLoaded}
                        >
                            <ZoomOut className="w-4 h-4" />
                        </Button>
                        <Input
                            value={`${Math.round(scale * 100)}%`}
                            readOnly
                            className="h-7 w-12 text-[10px] font-bold text-center border-none bg-transparent focus:ring-0 px-0"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-600 rounded-sm"
                            onClick={() => zoom(0.1)}
                            disabled={!isLoaded}
                        >
                            <ZoomIn className="w-4 h-4" />
                        </Button>
                    </div>

                    <Separator orientation="vertical" className="h-6 mx-1 hidden md:block" />

                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-600 rounded"
                            onClick={() => changePage(-1)}
                            disabled={pageNumber <= 1 || !isLoaded}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 px-2 min-w-[60px] justify-center">
                            <span>P. {pageNumber}</span>
                            <span className="text-slate-300">/</span>
                            <span className="text-slate-400">{numPages || '--'}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-600 rounded"
                            onClick={() => changePage(1)}
                            disabled={pageNumber >= (numPages || 1) || !isLoaded}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>

                    <Separator orientation="vertical" className="h-6 mx-1 hidden md:block" />

                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 rounded hidden md:flex"
                            onClick={rotate}
                            disabled={!isLoaded}
                        >
                            <RotateCw className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 rounded"
                            onClick={toggleFullscreen}
                            disabled={!isLoaded}
                        >
                            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                        </Button>
                        <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 rounded"
                            disabled={!isLoaded}
                        >
                            <a href={pdfUrl} download target="_blank" rel="noopener noreferrer">
                                <Download className="w-4 h-4" />
                            </a>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main View Area */}
            <div className="flex-1 overflow-auto flex justify-center p-4 md:p-8 no-scrollbar scroll-smooth bg-[#f0f2f5]">
                <div className="shadow-2xl bg-white relative">
                    {!isLoaded && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10 w-[600px] h-[800px]">
                            <div className="w-12 h-12 border-4 border-slate-200 border-t-rose-500 rounded-full animate-spin mb-4" />
                            <p className="text-xs font-bold text-slate-400 uppercase ">Loading...</p>
                        </div>
                    )}

                    <Document
                        file={pdfUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={null}
                        className="max-w-full"
                    >
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            rotate={rotation}
                            className="max-w-full"
                            loading={null}
                        />
                    </Document>
                </div>
            </div>

            {/* Footer Info */}
            <div className="h-8 bg-white border-t border-slate-200 px-4 flex items-center justify-between text-[12px] font-bold text-slate-400 shrink-0">
                <span>H-Class Digital Archive</span>
                <div className="flex items-center gap-4">
                    <span>Security Status: <span className="text-rose-600">Encrypted</span> </span>
                    <Badge variant="outline" className="text-[9px] h-4 rounded-none px-1 font-black bg-emerald-50 text-emerald-600 border-none uppercase">Certified Safe</Badge>
                </div>
            </div>
        </div>
    );
}
