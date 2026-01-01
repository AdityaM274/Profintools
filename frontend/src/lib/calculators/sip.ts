export interface SIPInputs {
    monthlyInvestment: number;
    expectedReturnRate: number;
    tenure: number; // in years
}

export interface SIPResult {
    totalInvestment: number;
    totalReturns: number;
    totalAmount: number;
    yearlyBreakdown: {
        year: number;
        invested: number;
        returns: number;
        total: number;
    }[];
}

export function calculateSIP(inputs: SIPInputs): SIPResult {
    const { monthlyInvestment, expectedReturnRate, tenure } = inputs;
    const monthlyRate = expectedReturnRate / (12 * 100);
    const totalMonths = tenure * 12;

    const totalAmount =
        monthlyInvestment *
        ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
        (1 + monthlyRate);

    const totalInvestment = monthlyInvestment * totalMonths;
    const totalReturns = totalAmount - totalInvestment;

    const yearlyBreakdown = [];
    for (let i = 1; i <= tenure; i++) {
        const months = i * 12;
        const yearAmount =
            monthlyInvestment *
            ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
            (1 + monthlyRate);
        const yearInvested = monthlyInvestment * months;

        yearlyBreakdown.push({
            year: i,
            invested: yearInvested,
            returns: yearAmount - yearInvested,
            total: yearAmount,
        });
    }

    return {
        totalInvestment,
        totalReturns,
        totalAmount,
        yearlyBreakdown,
    };
}
