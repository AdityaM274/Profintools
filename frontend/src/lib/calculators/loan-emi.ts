export interface LoanEMIInputs {
    principal: number;
    interestRate: number;
    tenure: number; // in years
}

export interface LoanEMIResult {
    monthlyEMI: number;
    totalInterest: number;
    totalPayment: number;
    amortizationSchedule: {
        month: number;
        principalPaid: number;
        interestPaid: number;
        remainingBalance: number;
    }[];
}

export function calculateLoanEMI(inputs: LoanEMIInputs): LoanEMIResult {
    const { principal, interestRate, tenure } = inputs;
    const monthlyRate = interestRate / (12 * 100);
    const totalMonths = tenure * 12;

    const monthlyEMI =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const totalPayment = monthlyEMI * totalMonths;
    const totalInterest = totalPayment - principal;

    const amortizationSchedule = [];
    let remainingBalance = principal;

    for (let i = 1; i <= totalMonths; i++) {
        const interestPaid = remainingBalance * monthlyRate;
        const principalPaid = monthlyEMI - interestPaid;
        remainingBalance -= principalPaid;

        amortizationSchedule.push({
            month: i,
            principalPaid,
            interestPaid,
            remainingBalance: Math.max(0, remainingBalance),
        });
    }

    return {
        monthlyEMI,
        totalInterest,
        totalPayment,
        amortizationSchedule,
    };
}
