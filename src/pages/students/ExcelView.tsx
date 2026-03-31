import React from "react";
import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

// Mock data based on Results.tsx
const resultsData = [
    { id: 1, year: "2023-2024", code: "1101 HSS", module: "Communication Skills", units: 10, score: 78, grade: "B+", points: 4.5 },
    { id: 2, year: "2023-2024", code: "1201 HSS", module: "Essentials Of International Relations", units: 15, score: 79, grade: "B+", points: 4.5 },
    { id: 3, year: "2023-2024", code: "1204 HSS", module: "French", units: 10, score: 77, grade: "B+", points: 4.5 },
    { id: 4, year: "2023-2024", code: "1203 HSS", module: "International Law", units: 15, score: 76, grade: "B+", points: 4.5 },
    { id: 5, year: "2024-2025", code: "1301 HSS", module: "International Negotiations", units: 15, score: 78, grade: "B+", points: 4.5 },
];

export default function ExcelView() {
    const navigate = useNavigate();

    // Convert resultsData to FortuneSheet celldata format
    const headers = ["#", "Academic Year", "Code", "Module", "Credit Units", "Score", "Grade", "Grade Pts"];

    const celldata = [];

    // Add headers
    headers.forEach((header, index) => {
        celldata.push({
            r: 0,
            c: index,
            v: {
                v: header,
                m: header,
                bl: 1, // bold
                bg: "#f8fafc", // slate-50
                fc: "#334155", // slate-700
            }
        });
    });

    // Add data rows
    resultsData.forEach((item, rIndex) => {
        const row = rIndex + 1;
        const values = [
            item.id.toString(),
            item.year,
            item.code,
            item.module,
            item.units.toString(),
            item.score.toString(),
            item.grade,
            item.points.toFixed(1)
        ];

        values.forEach((val, cIndex) => {
            celldata.push({
                r: row,
                c: cIndex,
                v: {
                    v: val,
                    m: val,
                }
            });
        });
    });

    const sheetData = [
        {
            name: "Student Results",
            color: "#1e4e96",
            status: 1,
            order: 0,
            celldata: celldata,
            config: {
                columnlen: {
                    0: 50,
                    1: 150,
                    2: 120,
                    3: 250,
                    4: 100,
                    5: 80,
                    6: 80,
                    7: 100
                }
            }
        }
    ];

    return (
        <div className="max-w-7xl mx-auto h-screen flex flex-col bg-slate-50 overflow-hidden">
            <div className="p-4 border-b bg-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(-1)}
                        className="rounded"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Results
                    </Button>
                    <h1 className="text-lg font-bold text-slate-800">Student Results Spreadsheet</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="rounded font-medium">Read Only Mode</Badge>
                </div>
            </div>

            <div className="flex-1 w-full relative">
                <Workbook data={sheetData} />
            </div>
        </div>
    );
}

