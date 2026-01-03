
export interface AmortizationRow {
    month: number;
    principalPaid: number;
    interestPaid: number;
    totalPayment: number;
    balance: number;
}

export function calculateEducationLoan(inputs: {
    loanAmount: number;
    interestRate: number;
    tenure: number;
    moratoriumPeriod?: number; // months of grace period (optional)
    interestDuringMoratorium?: boolean; // whether interest accumulates
}) {
    const { loanAmount, interestRate, tenure, moratoriumPeriod = 0, interestDuringMoratorium = true } = inputs;

    const monthlyRate = interestRate / 12 / 100;
    const totalMonths = tenure * 12;

    // Handle Moratorium (Simplified: interest accumulates and adds to principal, or is paid simple)
    // Common in India: Simple interest during moratorium is often accumulated
    let finalPrincipal = loanAmount;
    let accumulatedInterest = 0;

    if (moratoriumPeriod > 0 && interestDuringMoratorium) {
        // Simple interest often charged during study period
        accumulatedInterest = loanAmount * monthlyRate * moratoriumPeriod;
        finalPrincipal += accumulatedInterest;
    }

    // EMI Formula
    // E = P * r * (1+r)^n / ((1+r)^n - 1)
    const emi = (finalPrincipal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const amortization: AmortizationRow[] = [];
    let currentBalance = finalPrincipal;
    let totalInterestPayable = 0;

    for (let i = 1; i <= totalMonths; i++) {
        const interestForMonth = currentBalance * monthlyRate;
        const principalForMonth = emi - interestForMonth;

        currentBalance -= principalForMonth;
        if (currentBalance < 0) currentBalance = 0; // Floating point correction

        totalInterestPayable += interestForMonth;

        amortization.push({
            month: i,
            principalPaid: principalForMonth,
            interestPaid: interestForMonth,
            totalPayment: emi,
            balance: currentBalance
        });
    }

    // Total stats
    // If moratorium interest was added to principal, it's part of the loan now.
    // However, the "Total Interest" seen by user usually includes that initial chunk if they didn't pay it.

    return {
        emi,
        totalInterest: totalInterestPayable + accumulatedInterest,
        totalPayment: (emi * totalMonths), // The amount paid over the EMI tenure
        amortization, // Extended data for the table
        effectivePrincipal: finalPrincipal
    };
}
