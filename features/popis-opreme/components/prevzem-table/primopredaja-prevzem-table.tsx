"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2, FileSpreadsheet, Sparkles } from "lucide-react";

export interface OpremaItem {
    zapSt: string;
    vrstaOpreme: string;
    modelOpreme: string;
    serStOpreme: string;
    oprOpreme: string;
    stanje: string;
}

interface InlineOpremaTableProps {
    title: string;
    description?: string;
    items: OpremaItem[];
    onChange: (items: OpremaItem[]) => void;
    accentColor?: "default" | "amber" | "blue";
}

export function InlineOpremaTable({
    title,
    description,
    items,
    onChange,
    accentColor = "default",
}: InlineOpremaTableProps) {
    const [pasteModalOpen, setPasteModalOpen] = useState(false);
    const [pasteText, setPasteText] = useState("");

    // 1. Add single empty row
    const handleAddRow = () => {
        const newItem: OpremaItem = {
            zapSt: String(items.length + 1),
            vrstaOpreme: "",
            modelOpreme: "",
            serStOpreme: "",
            oprOpreme: "",
            stanje: "Novo",
        };
        onChange([...items, newItem]);
    };

    // 2. Update a cell value
    const handleCellChange = (
        index: number,
        field: keyof OpremaItem,
        value: string
    ) => {
        const updated = items.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        onChange(updated);
    };

    // 3. Remove row & renumber
    const handleRemoveRow = (indexToRemove: number) => {
        const updated = items
            .filter((_, i) => i !== indexToRemove)
            .map((item, i) => ({ ...item, zapSt: String(i + 1) }));
        onChange(updated);
    };

    // 4. Bulk Paste Parser (TSV from Excel/Sheets or comma-separated)
    const handleParsePaste = () => {
        if (!pasteText.trim()) return;

        const lines = pasteText
            .trim()
            .split(/\r?\n/)
            .filter((line) => line.trim().length > 0);

        const startIndex = items.length;
        const newItems: OpremaItem[] = lines.map((line, idx) => {
            // Excel copies as Tab-separated values
            const delimiter = line.includes("\t") ? "\t" : line.includes(";") ? ";" : ",";
            const cols = line.split(delimiter).map((c) => c.trim());

            return {
                zapSt: String(startIndex + idx + 1),
                vrstaOpreme: cols[0] || "",
                modelOpreme: cols[1] || "",
                serStOpreme: cols[2] || "",
                oprOpreme: cols[3] || "",
                stanje: cols[4] || "Novo",
            };
        });

        onChange([...items, ...newItems]);
        setPasteText("");
        setPasteModalOpen(false);
    };

    return (
        <div className="space-y-2.5">
            {/* Header Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold tracking-tight text-foreground">
                            {title}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground font-mono">
                            {items.length} {items.length === 1 ? "kos" : items.length >= 2 && items.length <= 4 ? "kosi" : "kosov"}
                        </span>
                    </div>
                    {description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* Bulk Paste from Excel button */}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPasteModalOpen(true)}
                        className="h-8 text-xs gap-1.5"
                    >
                        <FileSpreadsheet className="h-3.5 w-3.5 text-muted-foreground" />
                        Prilepi iz Excela
                    </Button>

                    {/* Add Single Row button */}
                    <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={handleAddRow}
                        className="h-8 text-xs gap-1"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Dodaj vrstico
                    </Button>
                </div>
            </div>

            {/* Scrollable Container with Sticky Header */}
            <div className="rounded-lg border bg-card/60 shadow-xs max-h-[340px] overflow-x-auto overflow-y-auto relative">
                <Table>
                    <TableHeader className="sticky top-0 bg-muted/90 backdrop-blur-sm z-10 border-b">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-12 text-center text-xs font-semibold">#</TableHead>
                            <TableHead className="w-[170px] min-w-[140px] text-xs font-semibold">Vrsta opreme</TableHead>
                            <TableHead className="w-[190px] min-w-[160px] text-xs font-semibold">Model opreme</TableHead>
                            <TableHead className="w-[160px] min-w-[140px] text-xs font-semibold">Serijska št.</TableHead>
                            <TableHead className="w-[150px] min-w-[120px] text-xs font-semibold">Inv. št. (OPR)</TableHead>
                            <TableHead className="w-[125px] min-w-[110px] text-xs font-semibold">Stanje</TableHead>
                            <TableHead className="w-11 text-center"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="h-28 text-center text-sm text-muted-foreground"
                                >
                                    <div className="flex flex-col items-center justify-center gap-1.5 py-4">
                                        <Sparkles className="h-5 w-5 text-muted-foreground/60" />
                                        <p className="font-medium text-foreground text-xs">
                                            Ni dodane opreme
                                        </p>
                                        <p className="text-xs text-muted-foreground max-w-sm">
                                            Začni z vnosom s klikom na gumb spodaj ali prilepi seznam neposredno iz Excela.
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleAddRow}
                                                className="h-7 text-xs"
                                            >
                                                <Plus className="h-3.5 w-3.5 mr-1" />
                                                Dodaj prvo vrstico
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setPasteModalOpen(true)}
                                                className="h-7 text-xs"
                                            >
                                                <FileSpreadsheet className="h-3.5 w-3.5 mr-1" />
                                                Uvozi iz preglednice
                                            </Button>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((item, index) => (
                                <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                                    {/* # Zap št */}
                                    <TableCell className="text-center font-mono text-xs text-muted-foreground p-2">
                                        {item.zapSt}
                                    </TableCell>

                                    {/* Vrsta opreme */}
                                    <TableCell className="p-1.5">
                                        <Input
                                            placeholder="npr. Prenosnik"
                                            value={item.vrstaOpreme}
                                            onChange={(e) =>
                                                handleCellChange(index, "vrstaOpreme", e.target.value)
                                            }
                                            className="h-8 text-xs bg-background/70 focus-visible:bg-background"
                                        />
                                    </TableCell>

                                    {/* Model */}
                                    <TableCell className="p-1.5">
                                        <Input
                                            placeholder="npr. MacBook Air M2"
                                            value={item.modelOpreme}
                                            onChange={(e) =>
                                                handleCellChange(index, "modelOpreme", e.target.value)
                                            }
                                            className="h-8 text-xs bg-background/70 focus-visible:bg-background"
                                        />
                                    </TableCell>

                                    {/* Serijska št */}
                                    <TableCell className="p-1.5">
                                        <Input
                                            placeholder="SN-..."
                                            value={item.serStOpreme}
                                            onChange={(e) =>
                                                handleCellChange(index, "serStOpreme", e.target.value)
                                            }
                                            className="h-8 text-xs font-mono bg-background/70 focus-visible:bg-background"
                                        />
                                    </TableCell>

                                    {/* Inv št */}
                                    <TableCell className="p-1.5">
                                        <Input
                                            placeholder="OPT-..."
                                            value={item.oprOpreme}
                                            onChange={(e) =>
                                                handleCellChange(index, "oprOpreme", e.target.value)
                                            }
                                            className="h-8 text-xs font-mono bg-background/70 focus-visible:bg-background"
                                        />
                                    </TableCell>

                                    {/* Stanje */}
                                    <TableCell className="p-1.5">
                                        <Select
                                            value={item.stanje}
                                            onValueChange={(val) =>
                                                handleCellChange(index, "stanje", val ?? "Novo")
                                            }
                                        >
                                            <SelectTrigger className="h-8 text-xs w-full bg-background/70">
                                                <SelectValue placeholder="Stanje" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Novo">Novo</SelectItem>
                                                <SelectItem value="Rabljeno">Rabljeno</SelectItem>
                                                <SelectItem value="Okvarjeno">Okvarjeno</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>

                                    {/* Delete Action */}
                                    <TableCell className="p-1.5 text-center">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveRow(index)}
                                            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                            title="Odstrani vrstico"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Modal for Bulk Excel Paste */}
            <Dialog open={pasteModalOpen} onOpenChange={setPasteModalOpen}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-base">
                            <FileSpreadsheet className="h-5 w-5 text-primary" />
                            Množični uvoz iz Excela ali preglednice
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Kopirajte stolpce iz Excela ali Google Sheets in jih prilepite spodaj.
                            Pričakovani vrstni red stolpcev:{" "}
                            <span className="font-semibold text-foreground">
                                Vrsta, Model, Serijska št., Inv. št., Stanje
                            </span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2 py-2">
                        <Textarea
                            placeholder={`Prenosnik\tMacBook Air M2\tSN-12345\tOPT-001\tNovo\nDock\tHP G6\tSN-67890\tOPT-002\tRabljeno`}
                            rows={8}
                            value={pasteText}
                            onChange={(e) => setPasteText(e.target.value)}
                            className="font-mono text-xs leading-relaxed resize-none"
                        />
                        <p className="text-[11px] text-muted-foreground">
                            Vsaka vrstica predstavlja en kos opreme. Polja naj bodo ločena s tabulatorjem (privzeto pri kopiranju iz Excela).
                        </p>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setPasteText("");
                                setPasteModalOpen(false);
                            }}
                        >
                            Prekliči
                        </Button>
                        <Button
                            type="button"
                            onClick={handleParsePaste}
                            disabled={!pasteText.trim()}
                        >
                            Uvozi podatke
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
