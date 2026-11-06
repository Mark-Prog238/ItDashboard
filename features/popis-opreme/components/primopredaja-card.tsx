"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PrimopredajaDatePicker } from "@/features/popis-opreme/components/primopredaja-date-picker";
import {
    InlineOpremaTable,
    OpremaItem,
} from "@/features/popis-opreme/components/prevzem-table/primopredaja-prevzem-table";
import { handleDownload } from "@/features/popis-opreme/functions/popis-opreme-function-download-client";
import { PrimopredajaData } from "@/features/popis-opreme/functions/popis-opreme-functions-dodxtemplater";
import {
    FileDown,
    FileText,
    RotateCcw,
    User,
    ArrowDownLeft,
    ArrowUpRight,
    CheckCircle2,
    Loader2,
} from "lucide-react";

const VRSTE_PRIMOPREDAJE = [
    { label: "Prevzem (izdaja nove opreme)", value: "P" },
    { label: "Zamenjava (menjava opreme)", value: "Z" },
    { label: "Vračilo (vrnitev v skladišče)", value: "V" },
];

export default function PrimopredajaCard() {
    // Form fields
    const [recepiant, setRecepiant] = useState("Mark Salamon");
    const [oddelek, setOddelek] = useState("IT");
    const [tipPrimopredaje, setTipPrimopredaje] = useState("P");
    const [razlozOpomba, setRazlozOpomba] = useState("");
    const [responsablePerson, setResponsablePerson] = useState("IT Služba");
    const [date, setDate] = useState<Date | undefined>(new Date());

    // Equipment arrays
    const [prevzetaOprema, setPrevzetaOprema] = useState<OpremaItem[]>([
        {
            zapSt: "1",
            vrstaOpreme: "",
            modelOpreme: "",
            serStOpreme: "",
            oprOpreme: "",
            stanje: "Novo",
        },
    ]);

    const [vrnjenaOprema, setVrnjenaOprema] = useState<OpremaItem[]>([]);
    const [downloadingFormat, setDownloadingFormat] = useState<"docx" | "pdf" | null>(null);
    const [downloadSuccess, setDownloadSuccess] = useState(false);

    // Show returned equipment section if "Zamenjava" or "Vračilo"
    const prikaziVrnjeno = tipPrimopredaje === "Z" || tipPrimopredaje === "V";

    const handleReset = () => {
        setRecepiant("");
        setOddelek("");
        setTipPrimopredaje("P");
        setRazlozOpomba("");
        setDate(new Date());
        setPrevzetaOprema([
            {
                zapSt: "1",
                vrstaOpreme: "",
                modelOpreme: "",
                serStOpreme: "",
                oprOpreme: "",
                stanje: "Novo",
            },
        ]);
        setVrnjenaOprema([]);
    };

    const handleDownloadAction = async (format: "docx" | "pdf") => {
        setDownloadingFormat(format);
        setDownloadSuccess(false);

        try {
            const formattedDate = date
                ? date.toLocaleDateString("sl-SI")
                : new Date().toLocaleDateString("sl-SI");

            const payload: PrimopredajaData = {
                recepiant,
                oddelek,
                vrstaPrimopredaje: tipPrimopredaje,
                razlozOpomba,
                responsablePerson,
                date: formattedDate,
                pOprema: prevzetaOprema,
                vOprema: prikaziVrnjeno ? vrnjenaOprema : [],
            };

            await handleDownload(payload, format);

            setDownloadSuccess(true);
            setTimeout(() => setDownloadSuccess(false), 4000);
        } catch (err: any) {
            console.error("Napaka pri prenosu dokumenta:", err);
            alert(err?.message || "Prišlo je do napake pri prenosu dokumenta.");
        } finally {
            setDownloadingFormat(null);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto py-6 px-4 sm:px-6 space-y-6">
            {/* Top Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                            <FileText className="h-3 w-3" /> IT Dokumenti
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Primopredajni zapisnik delovne opreme
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Pripravi novi dokument primopredaje, vnesi podatke in prenesi uradni zapisnik v PDF ali DOCX formatu.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        className="text-xs h-9 gap-1.5"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Ponastavi
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                {/* 1. Splošni podatki (Metadata Card) */}
                <Card className="shadow-xs border bg-card">
                    <CardHeader className="pb-3 border-b">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                                    <User className="h-4 w-4" />
                                </div>
                                <div>
                                    <CardTitle className="text-base font-semibold">
                                        1. Podatki o prejemniku in primopredaji
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Osnovni podatki o zaposlenem ter namenu primopredaje.
                                    </CardDescription>
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Prejemnik */}
                        <div className="space-y-1.5">
                            <Label htmlFor="recepiant" className="text-xs font-medium">
                                Prejemnik (Ime in Priimek) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="recepiant"
                                value={recepiant}
                                onChange={(e) => setRecepiant(e.target.value)}
                                placeholder="Ime in Priimek zaposlenega"
                                className="h-9 text-xs"
                                required
                            />
                        </div>

                        {/* Oddelek */}
                        <div className="space-y-1.5">
                            <Label htmlFor="oddelek" className="text-xs font-medium">
                                Oddelek / Lokacija <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="oddelek"
                                value={oddelek}
                                onChange={(e) => setOddelek(e.target.value)}
                                placeholder="npr. IT, Računovodstvo, Logistika"
                                className="h-9 text-xs"
                                required
                            />
                        </div>

                        {/* Vrsta Primopredaje */}
                        <div className="space-y-1.5">
                            <Label htmlFor="tipPrimopredaje" className="text-xs font-medium">
                                Vrsta primopredaje <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={tipPrimopredaje}
                                onValueChange={(val) => setTipPrimopredaje(val ?? "P")}
                            >
                                <SelectTrigger id="tipPrimopredaje" className="h-9 text-xs w-full">
                                    <SelectValue placeholder="Izberi vrsto" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Možnosti</SelectLabel>
                                        {VRSTE_PRIMOPREDAJE.map((tip) => (
                                            <SelectItem key={tip.value} value={tip.value} className="text-xs">
                                                {tip.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Datum */}
                        <div className="space-y-1.5">
                            <Label htmlFor="date" className="text-xs font-medium">
                                Datum zapisnika
                            </Label>
                            <PrimopredajaDatePicker date={date} setDate={setDate} />
                        </div>

                        {/* Odgovorna oseba (IT) */}
                        <div className="space-y-1.5 md:col-span-2">
                            <Label htmlFor="responsablePerson" className="text-xs font-medium">
                                Odgovorna oseba IT (izdajatelj)
                            </Label>
                            <Input
                                id="responsablePerson"
                                value={responsablePerson}
                                onChange={(e) => setResponsablePerson(e.target.value)}
                                placeholder="npr. Mark Salamon (IT skrbnik)"
                                className="h-9 text-xs"
                            />
                        </div>

                        {/* Opomba */}
                        <div className="space-y-1.5 md:col-span-2">
                            <Label htmlFor="razlozOpomba" className="text-xs font-medium">
                                Razlog / Opomba
                            </Label>
                            <Textarea
                                id="razlozOpomba"
                                value={razlozOpomba}
                                onChange={(e) => setRazlozOpomba(e.target.value)}
                                placeholder="npr. Menjava prenosnika zaradi okvare matične plošče..."
                                className="min-h-[36px] h-9 py-2 text-xs resize-none"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Seznam prevzete opreme Card */}
                <Card className="shadow-xs border bg-card">
                    <CardHeader className="pb-3 border-b">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <ArrowDownLeft className="h-4 w-4" />
                            </div>
                            <div>
                                <CardTitle className="text-base font-semibold">
                                    2. Seznam prevzete opreme
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Oprema, ki jo zaposleni prevzema v lastno uporabo in odgovornost.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <InlineOpremaTable
                            title="Prevzeta oprema"
                            description="Vnesi podatke za vsak izdan kos ali prilepi seznam neposredno iz Excela."
                            items={prevzetaOprema}
                            onChange={setPrevzetaOprema}
                        />
                    </CardContent>
                </Card>

                {/* 3. Seznam vrnjene opreme Card (shown for Menjava or Vračilo) */}
                {prikaziVrnjeno && (
                    <Card className="shadow-xs border border-amber-500/30 bg-card">
                        <CardHeader className="pb-3 border-b bg-amber-500/5">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400">
                                    <ArrowUpRight className="h-4 w-4" />
                                </div>
                                <div>
                                    <CardTitle className="text-base font-semibold">
                                        3. Seznam vrnjene opreme
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Oprema, ki jo zaposleni vrača nazaj v IT oddelek ali skladišče.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <InlineOpremaTable
                                title="Vrnjena oprema"
                                description="Vnesi opremo, ki jo zaposleni vrača ob zamenjavi ali prekinitvi delovnega razmerja."
                                items={vrnjenaOprema}
                                onChange={setVrnjenaOprema}
                            />
                        </CardContent>
                    </Card>
                )}

                {/* Sticky / Footer Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border bg-card shadow-sm">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div>
                            Prevzeto:{" "}
                            <span className="font-semibold text-foreground font-mono">
                                {prevzetaOprema.length}
                            </span>{" "}
                            {prevzetaOprema.length === 1 ? "kos" : "kosov"}
                        </div>
                        {prikaziVrnjeno && (
                            <>
                                <span>•</span>
                                <div>
                                    Vrnjeno:{" "}
                                    <span className="font-semibold text-foreground font-mono">
                                        {vrnjenaOprema.length}
                                    </span>{" "}
                                    {vrnjenaOprema.length === 1 ? "kos" : "kosov"}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleDownloadAction("docx")}
                            disabled={downloadingFormat !== null}
                            className="text-xs h-9 gap-1.5 shadow-xs"
                        >
                            {downloadingFormat === "docx" ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <FileDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            )}
                            Prenesi DOCX (.docx)
                        </Button>
                        <Button
                            type="button"
                            onClick={() => handleDownloadAction("pdf")}
                            disabled={downloadingFormat !== null}
                            className="text-xs h-9 gap-1.5 shadow-xs min-w-[160px]"
                        >
                            {downloadingFormat === "pdf" ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Generiram PDF...
                                </>
                            ) : downloadSuccess ? (
                                <>
                                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                                    Dokument prenesen!
                                </>
                            ) : (
                                <>
                                    <FileText className="h-4 w-4 text-red-300" />
                                    Prenesi PDF (.pdf)
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
