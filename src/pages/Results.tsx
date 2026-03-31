import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface ResultEntry {
  id: number;
  year: string;
  code: string;
  module: string;
  units: number;
  score: number;
  grade: string;
  points: number;
}

const resultsData: ResultEntry[] = [
  { id: 1, year: "2023-2024", code: "1101 HSS", module: "Communication Skills", units: 10, score: 78, grade: "B+", points: 4.5 },
  { id: 2, year: "2023-2024", code: "1201 HSS", module: "Essentials Of International Relations", units: 15, score: 79, grade: "B+", points: 4.5 },
  { id: 3, year: "2023-2024", code: "1204 HSS", module: "French", units: 10, score: 77, grade: "B+", points: 4.5 },
  { id: 4, year: "2023-2024", code: "1203 HSS", module: "International Law", units: 15, score: 76, grade: "B+", points: 4.5 },
  { id: 5, year: "2024-2025", code: "1301 HSS", module: "International Negotiations", units: 15, score: 78, grade: "B+", points: 4.5 },
];

const Results = () => {
  const [year, setYear] = useState("Year 1");

  return (
    <div className="space-y-4 max-w-7xl mx-auto py-2 px-6 animate-in fade-in duration-700">
      {/* Page Title */}
      {/* <h1 className="text-sm font-bold text-[#1e4e96] mt-4 mb-6">My Results</h1> */}
      {/* Filter and Export */}
      <div className="flex items-center gap-4 mb-8">
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-[340px] h-11 border-slate-200 focus:ring-0 focus:ring-offset-0 ring-0 ring-offset-0 text-[14px] text-slate-700 rounded bg-white px-4 shadow-none outline-none">
            <SelectValue placeholder="Year 1" />
          </SelectTrigger>
          <SelectContent className="rounded-none border-slate-200">
            <SelectItem value="Year 1" className="rounded-none text-[#3b82f6] font-bold py-2">WEEK 1</SelectItem>
            <SelectItem value="Year 2" className="rounded-none text-slate-600 py-2">WEEK 2</SelectItem>
            <SelectItem value="Year 3" className="rounded-none text-slate-600 py-2">WEEK 3</SelectItem>
          </SelectContent>
        </Select>

        <Link to="/export-pdf">
          <Button className="bg-blue-800 w-60 hover:bg-blue-700  text-white px-12 h-10 rounded text-[12px] font-bold">
            Export To PDF
          </Button>
        </Link>

        <Link to="/excel-view">
          <Button variant="destructive" className="  bg-rose-800 hover:bg-rose-700 text-white px-12 h-10 rounded text-[12px] font-bold">
            View Excel For Evaluation
          </Button>
        </Link>
      </div>

      {/* Legend and Summary Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2 border-b border-transparent">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-bold italic text-red-500">
          <span>M.E: Missed Examination</span>
          <span>R: Retake</span>
          <span>EX: Exempted</span>
          <span>CR: Credit Transfer</span>
        </div>
        <div className="flex gap-8 text-[12px] font-medium text-slate-800">
          <div className="flex items-center gap-2">
            <span>GPA:</span>
            <span>4.64</span>
          </div>
          <div className="flex items-center gap-2">
            <span>CGPA:</span>
            <span>4.49</span>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className=" bg-white">
        <Table>
          <TableHeader>
            <TableRow className="border-b-[0.5px] border-slate-200 bg-slate-50/30 hover:bg-slate-50/30">
              <TableHead className="w-[50px] text-sm font-semibold text-slate-700 border-r-[0.5px] border-slate-200">#</TableHead>
              <TableHead className="font-semibold text-slate-700 border-r-[0.5px] border-slate-200">Academic Year</TableHead>
              <TableHead className="font-semibold text-slate-700 border-r-[0.5px] border-slate-200">Code</TableHead>
              <TableHead className="font-semibold text-slate-700 border-r-[0.5px] border-slate-200">Module</TableHead>
              <TableHead className="text-right font-semibold text-slate-700 border-r-[0.5px] border-slate-200 pr-6">Credit Units</TableHead>
              <TableHead className="text-right font-semibold text-slate-700 border-r-[0.5px] border-slate-200 pr-6">Score</TableHead>
              <TableHead className="text-center font-semibold text-slate-700 border-r-[0.5px] border-slate-200">Grade</TableHead>
              <TableHead className="text-right font-semibold text-slate-700 pr-6">Grade Pts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resultsData.map((item, index) => (
              <TableRow key={item.id} className="border-b-[0.5px] border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                <TableCell className="border-r-[0.5px] border-slate-100 text-[13px] text-slate-500">{item.id}</TableCell>
                <TableCell className="border-r-[0.5px] border-slate-100 text-[13px] text-slate-500 font-medium">{item.year}</TableCell>
                <TableCell className="border-r-[0.5px] border-slate-100 text-[13px] text-slate-500">{item.code}</TableCell>
                <TableCell className="border-r-[0.5px] border-slate-100 text-[13px] text-slate-500">{item.module}</TableCell>
                <TableCell className="border-r-[0.5px] border-slate-100 text-right text-[13px] text-slate-500 pr-6">{item.units}</TableCell>
                <TableCell className="border-r-[0.5px] border-slate-100 text-right text-[13px] text-slate-500 pr-6">{item.score}</TableCell>
                <TableCell className="border-r-[0.5px] border-slate-100 text-center text-[13px] font-medium text-slate-700">{item.grade}</TableCell>
                <TableCell className="text-right text-[13px] text-slate-500 pr-6">{item.points.toFixed(1)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Container */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-8 pb-10 text-[12px] text-slate-500">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 rounded-none hover:text-slate-600 ">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center justify-center h-8 w-8 bg-slate-50 border border-slate-200 text-[#1e4e96] font-bold">
            1
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none text-slate-300 hover:text-slate-600">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <span>Go to</span>
          <div className="h-8 w-10 border border-slate-200 bg-white flex items-center justify-center text-[#1e4e96] font-bold">1</div>
        </div>

        <div className="flex items-center gap-2">
          <Select defaultValue="20">
            <SelectTrigger className="h-8 w-[100px] border-slate-200 focus:ring-0 focus:ring-offset-0 ring-0 ring-offset-0 text-[14px] text-slate-700 rounded bg-white px-4 shadow-none outline-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-none">
              <SelectItem value="10" className="rounded-none">10/page</SelectItem>
              <SelectItem value="20" className="rounded-none">20/page</SelectItem>
              <SelectItem value="50" className="rounded-none">50/page</SelectItem>
            </SelectContent>
          </Select>
          <span className="ml-4 text-slate-800 font-bold">Total {resultsData.length}</span>
        </div>
      </div>
    </div>
  );
};

export default Results;
