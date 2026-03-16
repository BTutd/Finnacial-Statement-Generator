"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, X, Check, AlertCircle } from "lucide-react";
import { parseFile, ParsedFileData } from "@/lib/fileParser";
import { toast } from "sonner";

interface FileUploadProps {
  onDataParsed: (data: ParsedFileData) => void;
}

export function FileUpload({ onDataParsed }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parseResult, setParseResult] = useState<ParsedFileData | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) await processFile(droppedFile);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) await processFile(selectedFile);
  };

  const processFile = async (selectedFile: File) => {
    const validExtensions = [".csv", ".xlsx", ".xls"];
    const hasValidExtension = validExtensions.some(ext =>
      selectedFile.name.toLowerCase().endsWith(ext)
    );

    if (!hasValidExtension) {
      toast.error("Please upload a CSV or Excel file (.csv, .xlsx, .xls)");
      return;
    }

    setFile(selectedFile);
    setParsing(true);
    setParseResult(null);

    try {
      const result = await parseFile(selectedFile);
      setParseResult(result);
      toast.success(`File parsed successfully! Found ${result.transactions.length} transactions.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to parse file");
    } finally {
      setParsing(false);
    }
  };

  const handleApply = () => {
    if (!parseResult) return;
    onDataParsed(parseResult);
    toast.success("Financial data applied to the forms!");
  };

  const handleClear = () => {
    setFile(null);
    setParseResult(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <Card className="border-border bg-card shadow-soft">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-accent" />
          <h3 className="font-display text-lg font-semibold">Upload Financial Data</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Upload CSV or Excel files with your financial data
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drag & Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            relative cursor-pointer rounded-lg border-2 border-dashed p-8
            transition-all duration-200
            ${isDragging 
              ? "border-accent bg-accent/5" 
              : "border-border hover:border-accent/50 hover:bg-secondary/30"}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-3 text-center">
            <div className={`
              rounded-full p-3 transition-colors
              ${isDragging ? "bg-accent/10 text-accent" : "bg-secondary text-muted-foreground"}
            `}>
              <Upload className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {isDragging ? "Drop your file here" : "Drag & drop or click to upload"}
              </p>
              <p className="text-sm text-muted-foreground">Supports CSV, XLSX, XLS</p>
            </div>
          </div>
        </div>

        {/* File Preview */}
        {file && (
          <div className="rounded-lg border border-border bg-secondary/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-5 w-5 text-accent" />
                <div>
                  <p className="font-medium text-foreground">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {parsing && (
              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                Parsing file...
              </div>
            )}

            {parseResult && (
              <div className="mt-4 space-y-3">
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2 text-success">
                    <Check className="h-4 w-4" />
                    <span>{parseResult.transactions.length} transactions found</span>
                  </div>
                  {parseResult.incomeData && (
                    <div className="flex items-center gap-2 text-success">
                      <Check className="h-4 w-4" />
                      <span>Income statement data detected</span>
                    </div>
                  )}
                  {parseResult.balanceData && (
                    <div className="flex items-center gap-2 text-success">
                      <Check className="h-4 w-4" />
                      <span>Balance sheet data detected</span>
                    </div>
                  )}
                  {!parseResult.incomeData &&
                    !parseResult.balanceData &&
                    parseResult.transactions.length === 0 && (
                      <div className="flex items-center gap-2 text-warning">
                        <AlertCircle className="h-4 w-4" />
                        <span>No recognizable financial data found</span>
                      </div>
                    )}
                </div>

                <Button onClick={handleApply} variant="accent" className="w-full">
                  <Check className="h-4 w-4 mr-2" />
                  Apply Data
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}