"use server";

import fs from "fs/promises";
import path from "path";
import os from "os";
import { execFile } from "child_process";
import { promisify } from "util";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

const execFileAsync = promisify(execFile);

export interface OpremaItemData {
    zapSt: string;
    vrstaOpreme: string;
    modelOpreme: string;
    serStOpreme: string;
    oprOpreme: string;
    stanje: string;
    zapS?: string;
}

export interface PrimopredajaData {
    recepiant: string;
    oddelek: string;
    vrstaPrimopredaje: string;
    razlozOpomba?: string;
    responsablePerson?: string;
    date?: string;
    pOprema: OpremaItemData[];
    vOprema?: OpremaItemData[];
}

function fileNamePrefix(type: string): string {
    switch (type.trim().toLowerCase()) {
        case "p":
        case "prevzem":
            return "P";
        case "v":
        case "vracilo":
        case "vračilo":
            return "V";
        case "z":
        case "zamenjava":
        case "menjava":
            return "Z";
        default:
            return "DOC";
    }
}

function formatVrstaName(type: string): string {
    switch (type.trim().toUpperCase()) {
        case "P":
            return "prevzem";
        case "Z":
            return "zamenjava";
        case "V":
            return "vračilo";
        default:
            return type;
    }
}

// Find LibreOffice / soffice executable across Windows, Linux (Docker), macOS
function getSofficeCandidates(): string[] {
    if (process.env.LIBREOFFICE_PATH) {
        return [process.env.LIBREOFFICE_PATH];
    }
    if (process.platform === "win32") {
        return [
            "C:\\Program Files\\LibreOffice\\program\\soffice.exe",
            "C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe",
            "soffice.exe",
            "libreoffice.exe",
        ];
    }
    // Linux / Docker container
    return ["libreoffice", "soffice", "/usr/bin/libreoffice", "/usr/bin/soffice"];
}

// Convert DOCX Buffer to PDF Buffer via LibreOffice headless
async function convertDocxToPdfWithLibreOffice(docxBuffer: Buffer): Promise<Buffer> {
    const candidates = getSofficeCandidates();
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "libreoffice-"));
    const tempDocx = path.join(tempDir, "document.docx");
    const tempPdf = path.join(tempDir, "document.pdf");

    try {
        await fs.writeFile(tempDocx, docxBuffer);

        let converted = false;
        let lastError: any = null;

        for (const bin of candidates) {
            try {
                await execFileAsync(bin, [
                    "--headless",
                    "--convert-to",
                    "pdf",
                    "--outdir",
                    tempDir,
                    tempDocx,
                ]);
                converted = true;
                break;
            } catch (err: any) {
                lastError = err;
                if (err?.code !== "ENOENT") {
                    // Executable exists but failed to convert
                    break;
                }
            }
        }

        if (!converted) {
            if (lastError?.code === "ENOENT") {
                throw new Error(
                    "LibreOffice (libreoffice/soffice) ni bil najden v sistemu. " +
                    "V Dockerju se prepričajte, da je v teku namestitev 'libreoffice-writer' in pisav."
                );
            }
            throw new Error(`Napaka pri pretvorbi z LibreOffice: ${lastError?.message || lastError}`);
        }

        const pdfBuffer = await fs.readFile(tempPdf);
        return pdfBuffer;
    } finally {
        // Clean up temporary directory and files
        await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
    }
}

export const pripraviPopisFile = async (
    customData?: PrimopredajaData,
    format: "docx" | "pdf" = "docx"
) => {
    // 1. Load the docx template file as binary content
    const templatePath = path.join(process.cwd(), "file.docx");
    const content = await fs.readFile(templatePath);

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });

    const data: PrimopredajaData = customData ?? {
        recepiant: "Mark Salamon",
        oddelek: "IT",
        vrstaPrimopredaje: "zamenjava",
        razlozOpomba: "Redna menjava opreme",
        pOprema: [
            {
                zapSt: "1",
                vrstaOpreme: "Laptop",
                modelOpreme: "Macbook Air M2",
                serStOpreme: "SN-75399",
                oprOpreme: "OPT-26-1232324",
                stanje: "Novo",
            },
        ],
        vOprema: [
            {
                zapSt: "1",
                vrstaOpreme: "Dock",
                modelOpreme: "HP G6",
                serStOpreme: "SN-75399",
                oprOpreme: "OPT-26-1232324",
                stanje: "Rabljeno",
            },
        ],
        responsablePerson: "Mark Salamon (IT skrbnik)",
        date: new Date().toLocaleDateString("sl-SI"),
    };

    const vrstaRaw = (data.vrstaPrimopredaje || "P").trim();
    const vrstaWord = formatVrstaName(vrstaRaw);
    const isPrevzem = vrstaRaw.toUpperCase() === "P" || vrstaWord.toLowerCase() === "prevzem";
    const prikaziVrnjeno = !isPrevzem && (data.vOprema?.length ?? 0) > 0;

    const opremaNames = (data.pOprema || [])
        .map((oprema) => `${oprema.vrstaOpreme || "Oprema"}-${oprema.oprOpreme || oprema.serStOpreme || ""}`)
        .join("_");

    const prefix = fileNamePrefix(vrstaRaw);
    const safeRecipient = (data.recepiant || "Neznan").replace(/[/\\?%*:|"<>]/g, "");
    const safeOprema = opremaNames.replace(/[/\\?%*:|"<>]/g, "").slice(0, 50);
    const baseName = `${prefix}-${safeRecipient}${safeOprema ? `-${safeOprema}` : ""}`;

    // Map vOprema so both zapSt and zapS (as named in template) are populated
    const mappedVOprema = (data.vOprema || []).map((item, idx) => ({
        ...item,
        zapSt: item.zapSt || String(idx + 1),
        zapS: item.zapSt || String(idx + 1),
    }));

    const mappedPOprema = (data.pOprema || []).map((item, idx) => ({
        ...item,
        zapSt: item.zapSt || String(idx + 1),
    }));

    doc.render({
        recepiant: data.recepiant,
        oddelek: data.oddelek,
        vrstaPrimopredaje: vrstaWord,
        razlozOpomba: data.razlozOpomba || "/",
        responsablePerson: data.responsablePerson || "IT Oddelek",
        date: data.date ?? new Date().toLocaleDateString("sl-SI"),
        prikaziVrnjeno: prikaziVrnjeno,
        pOprema: mappedPOprema,
        vOprema: prikaziVrnjeno ? mappedVOprema : [],
        zapIzj: prikaziVrnjeno ? "4" : "3",
    });

    const docxBuf = doc.getZip().generate({
        type: "nodebuffer",
        compression: "DEFLATE",
    });

    if (format === "docx") {
        return {
            outputFileName: `${baseName}.docx`,
            base64: docxBuf.toString("base64"),
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        };
    }

    // PDF requested via LibreOffice
    const pdfBuf = await convertDocxToPdfWithLibreOffice(docxBuf);

    return {
        outputFileName: `${baseName}.pdf`,
        base64: pdfBuf.toString("base64"),
        mimeType: "application/pdf",
    };
};
