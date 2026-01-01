export interface FDInputs {
    depositAmount: number;
    interestRate: number;
    tenure: number; // in years
    compoundingFrequency: 'monthly' | 'quarterly' | 'half-yearly' | 'annually';
}

export interface FDResult {
    totalInvestment: number;
    estimatedReturns: number;
    totalValue: number;
}

export function calculateFD(inputs: FDInputs): FDResult {
    const { depositAmount, interestRate, tenure, compoundingFrequency } = inputs;

    const frequencyMap = {
        monthly: 12,
        quarterly: 4,
        'half-yearly': 2,
        annually: 1
    };

    const n = frequencyMap[compoundingFrequency];
    const r = interestRate / 100;

    const totalValue = depositAmount * Math.pow(1 + r / n, n * tenure);
    const estimatedReturns = totalValue - depositAmount;

    return {
        totalInvestment: depositAmount,
        estimatedReturns,
        totalValue
    };
}
