
// AUTO LOAN CALCULATOR
export function calculateAutoLoan(inputs: { vehiclePrice: number; downPayment: number; tradeInValue: number; interestRate: number; loanTerm: number; salesTax: number }) {
    const { vehiclePrice, downPayment, tradeInValue, interestRate, loanTerm, salesTax } = inputs;

    const taxableAmount = vehiclePrice - tradeInValue; // Simplified tax logic
    const taxAmount = (taxableAmount * salesTax) / 100;
    const totalVehicleCost = vehiclePrice + taxAmount;

    const loanAmount = totalVehicleCost - downPayment - tradeInValue;

    if (loanAmount <= 0) {
        return { monthlyPayment: 0, totalInterest: 0, totalPayment: 0 };
    }

    const r = interestRate / 100 / 12;
    const n = loanTerm; // months

    const monthlyPayment = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = monthlyPayment * n;
    const totalInterest = totalPayment - loanAmount;

    return { monthlyPayment, totalInterest, totalPayment, loanAmount };
}
