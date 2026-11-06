// config/templates.ts
import { TemplateMetadata} from "@/features/popis-opreme/types";

export const TEMPLATES: TemplateMetadata[] = [
    {
        id: 'employment-contract',
        name: 'Employment Agreement',
        description: 'Standard full-time employment agreement',
        fileName: 'employment_contract.docx',
        fields: [
            { key: 'candidateName', label: 'Candidate Name', type: 'text', required: true },
            { key: 'jobTitle', label: 'Job Title', type: 'text', required: true },
            { key: 'startDate', label: 'Start Date', type: 'date', required: true },
            { key: 'annualSalary', label: 'Annual Salary ($)', type: 'number', required: true }
        ]
    },
    {
        id: 'nda',
        name: 'Non-Disclosure Agreement (NDA)',
        description: 'Mutual non-disclosure agreement',
        fileName: 'nda.docx',
        fields: [
            { key: 'disclosingParty', label: 'Disclosing Party', type: 'text', required: true },
            { key: 'receivingParty', label: 'Receiving Party', type: 'text', required: true },
            { key: 'effectiveDate', label: 'Effective Date', type: 'date', required: true }
        ]
    }
];