"use client";

import {
    pripraviPopisFile,
    PrimopredajaData,
} from "@/features/popis-opreme/functions/popis-opreme-functions-dodxtemplater";

export const handleDownload = async (
    formData?: PrimopredajaData,
    format: "docx" | "pdf" = "docx"
) => {
    // 1. Call server action with form data and requested format (docx or pdf)
    const { outputFileName, base64, mimeType } = await pripraviPopisFile(
        formData,
        format
    );

    // 2. Convert base64 string to Blob
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], {
        type:
            mimeType ||
            (format === "pdf"
                ? "application/pdf"
                : "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
    });

    // 3. Trigger client download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = outputFileName;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};
