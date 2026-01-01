export interface RetirementInputs {
    currentAge: number;
    retirementAge: number;
    lifeExpectancy: number;
    currentSavings: number;
    monthlySavings: number;
    expectedReturn: number; // Pre-retirement
    inflationRate: number;
    requiredIncome: number; // Current value
}

export interface RetirementResult {
    totalCorpusNeeded: number;
    projectedCorpus: number;
    shortfall: number;
    yearsLasting: number;
    monthlyIncomeAtRetirement: number;
    corpusChart: { age: number; balance: number }[];
}

export function calculateRetirement(inputs: RetirementInputs): RetirementResult {
    const {
        currentAge,
        retirementAge,
        lifeExpectancy,
        currentSavings,
        monthlySavings,
        expectedReturn,
        inflationRate,
        requiredIncome
    } = inputs;

    const yearsToRetire = retirementAge - currentAge;
    const yearsInRetirement = lifeExpectancy - retirementAge;

    // Monthly rates
    const r = expectedReturn / 100 / 12;
    const inf = inflationRate / 100 / 12;

    // 1. Calculate Future Value of Current Savings & Monthly Contributions
    let balance = currentSavings;
    const corpusChart = [];

    for (let i = 0; i <= yearsToRetire * 12; i++) {
        if (i > 0) balance = balance * (1 + r) + monthlySavings;
        if (i % 12 === 0) {
            corpusChart.push({
                age: currentAge + i / 12,
                balance: Math.round(balance)
            });
        }
    }
    const projectedCorpus = balance;

    // 2. Calculate Required Corpus
    // Future value of monthly expenses at retirement
    const monthlyExpensesAtRetire = requiredIncome * Math.pow(1 + inflationRate / 100, yearsToRetire);

    // Corpus needed to sustain these expenses for yearsInRetirement
    // Assuming post-retirement return equals inflation (conservative) -> simple multiplication
    // Or assuming slightly higher return. Let's use a standard withdrawal rate logic or annuity formula.
    // Let's assume post-retirement return is 2% above inflation.
    const realRate = 0.02 / 12;
    const monthsInRetirement = yearsInRetirement * 12;

    const totalCorpusNeeded = monthlyExpensesAtRetire * ((1 - Math.pow(1 + realRate, -monthsInRetirement)) / realRate);

    const shortfall = Math.max(0, totalCorpusNeeded - projectedCorpus);

    return {
        totalCorpusNeeded,
        projectedCorpus,
        shortfall,
        yearsLasting: shortfall > 0 ? 0 : yearsInRetirement, // Simplified
        monthlyIncomeAtRetirement: monthlyExpensesAtRetire,
        corpusChart
    };
}
