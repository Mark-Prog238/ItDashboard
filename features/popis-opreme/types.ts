// types/template.ts

export type FieldType = 'text' | 'number' | 'date' | 'textarea';

export interface TemplateField {
    key: string;
    label: string;
    type: FieldType;
    required?: boolean;
    placeholder?: string;
}

export interface TemplateMetadata {
    id: string;
    name: string;
    description: string;
    fileName: string;
    fields: TemplateField[];
}

export interface GenerateDocumentRequest {
    templateId: string;
    data: Record<string, string | number>;
    format: 'docx' | 'pdf';
}

export type Oprema = {
    Id: number
    Vrsta: string
    Model: string
    Serial: string
    Opr: string
    Stanje: string

}