
// SAVINGS GOAL
export function calculateSavingsGoal(inputs: { targetAmount: number; currentSaved: number; years: number; interestRate: number }) {
    const { targetAmount, currentSaved, years, interestRate } = inputs;
    const r = interestRate / 100 / 12;
    const n = years * 12;

    // Future Value of Current Savings
    const fvCurrent = currentSaved * Math.pow(1 + r, n);
    const remainingTarget = targetAmount - fvCurrent;

    if (remainingTarget <= 0) return { monthlyInvestment: 0, totalSaved: fvCurrent };

    // PMT formula
    const monthlyInvestment = remainingTarget * r / (Math.pow(1 + r, n) - 1);

    return {
        monthlyInvestment,
        totalSaved: targetAmount
    };
}

// INFLATION
export function calculateInflation(inputs: { currentCost: number; inflationRate: number; years: number }) {
    const { currentCost, inflationRate, years } = inputs;
    const futureCost = currentCost * Math.pow(1 + inflationRate / 100, years);
    const lossOfValue = futureCost - currentCost;
    return { futureCost, lossOfValue };
}

// CAGR
export function calculateCAGR(inputs: { initialValue: number; finalValue: number; years: number }) {
    const { initialValue, finalValue, years } = inputs;
    const cagr = (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
    return { cagr, growth: finalValue - initialValue };
}

// GST
export function calculateGST(inputs: { amount: number; gstRate: number; type: 'exclusive' | 'inclusive' }) {
    const { amount, gstRate, type } = inputs;
    let gstAmount = 0;
    let netAmount = 0;
    let totalAmount = 0;

    if (type === 'exclusive') {
        gstAmount = (amount * gstRate) / 100;
        netAmount = amount;
        totalAmount = amount + gstAmount;
    } else {
        gstAmount = amount - (amount * (100 / (100 + gstRate)));
        netAmount = amount - gstAmount;
        totalAmount = amount;
    }

    return { gstAmount, netAmount, totalAmount };
}

// PPF
export function calculatePPF(inputs: { yearlyInvestment: number; years: number; interestRate: number }) {
    const { yearlyInvestment, years, interestRate } = inputs;
    let totalInterest = 0;
    let totalInvestment = 0;
    let maturityAmount = 0;

    // PPF interest is compounded annually (simplified)
    for (let i = 0; i < years; i++) {
        totalInvestment += yearlyInvestment;
        const interest = (maturityAmount + yearlyInvestment) * (interestRate / 100);
        totalInterest += interest;
        maturityAmount += yearlyInvestment + interest;
    }

    return { maturityAmount, totalInvestment, totalInterest };
}

// Simple Interest
export function calculateSimpleInterest(inputs: { principal: number; rate: number; time: number }) {
    const { principal, rate, time } = inputs;
    const interest = (principal * rate * time) / 100;
    const totalAmount = principal + interest;
    return { interest, totalAmount };
}

// Compound Interest
export function calculateCompoundInterest(inputs: { principal: number; rate: number; time: number; frequency: string }) {
    const { principal, rate, time, frequency } = inputs;
    let n = 1;
    if (frequency === 'monthly') n = 12;
    else if (frequency === 'quarterly') n = 4;
    else if (frequency === 'half-yearly') n = 2;

    const amount = principal * Math.pow((1 + (rate / 100) / n), n * time);
    const interest = amount - principal;
    return { interest, totalAmount: amount };
}

// HRA
export function calculateHRA(inputs: { basicSalary: number; da: number; hraReceived: number; rentPaid: number; cityType: 'metro' | 'non-metro' }) {
    const { basicSalary, da, hraReceived, rentPaid, cityType } = inputs;
    const salary = basicSalary + da;

    // 1. Actual HRA received
    const condition1 = hraReceived;

    // 2. Rent paid - 10% of salary
    const condition2 = rentPaid - (0.1 * salary);

    // 3. 50% of salary for metro, 40% for non-metro
    const condition3 = (cityType === 'metro' ? 0.5 : 0.4) * salary;

    const exemptHRA = Math.max(0, Math.min(condition1, condition2, condition3));
    const taxableHRA = Math.max(0, hraReceived - exemptHRA);

    return { exemptHRA, taxableHRA };
}

// NPS (Simplified)
export function calculateNPS(inputs: { monthlyInvestment: number; currentAge: number; retirementAge: number; expectedReturn: number }) {
    const { monthlyInvestment, currentAge, retirementAge, expectedReturn } = inputs;
    const years = retirementAge - currentAge;
    const months = years * 12;
    const r = expectedReturn / 100 / 12;

    // FV = P * ((1+r)^n - 1) * (1+r)/r
    const totalCorpus = monthlyInvestment * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
    const totalInvestment = monthlyInvestment * months;
    const totalInterest = totalCorpus - totalInvestment;

    return { totalCorpus, totalInvestment, totalInterest };
}
