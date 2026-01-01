export interface TaxInputs {
    annualIncome: number;
    investments: number; // 80C etc.
    otherDeductions: number;
}

export interface TaxResult {
    taxableIncome: number;
    totalTax: number;
    cess: number;
    netTax: number;
    taxSlabs: {
        slab: string;
        rate: string;
        tax: number;
    }[];
}

export function calculateIncomeTax(inputs: TaxInputs): TaxResult {
    const { annualIncome, investments, otherDeductions } = inputs;

    // Simplified calculation based on a generic slab-based system
    // Example: 0-250k: Nil, 250k-500k: 5%, 500k-1M: 20%, >1M: 30%
    // Deductions capped at 150k for 80C (example)
    const deductions = Math.min(investments, 150000) + otherDeductions;
    const taxableIncome = Math.max(0, annualIncome - deductions);

    let totalTax = 0;
    const taxSlabs = [];

    if (taxableIncome > 1000000) {
        const tax = (taxableIncome - 1000000) * 0.3;
        totalTax += tax;
        taxSlabs.push({ slab: '> 1,000,000', rate: '30%', tax });
    }

    if (taxableIncome > 500000) {
        const amount = Math.min(taxableIncome, 1000000) - 500000;
        const tax = amount * 0.2;
        totalTax += tax;
        taxSlabs.push({ slab: '500,000 - 1,000,000', rate: '20%', tax });
    }

    if (taxableIncome > 250000) {
        const amount = Math.min(taxableIncome, 500000) - 250000;
        const tax = amount * 0.05;
        totalTax += tax;
        taxSlabs.push({ slab: '250,000 - 500,000', rate: '5%', tax });
    } else {
        taxSlabs.push({ slab: '0 - 250,000', rate: '0%', tax: 0 });
    }

    const cess = totalTax * 0.04; // 4% Health & Education cess
    const netTax = totalTax + cess;

    return {
        taxableIncome,
        totalTax,
        cess,
        netTax,
        taxSlabs: taxSlabs.reverse()
    };
}
