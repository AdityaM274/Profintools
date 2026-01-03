import { calculateLoanEMI } from './loan-emi';
import { calculateSIP } from './sip';
import { calculateIncomeTax } from './income-tax';
import { calculateFD } from './fd';
import { calculateBMI } from './bmi';
import { calculateRetirement } from './retirement';
import { calculateSavingsGoal, calculateInflation, calculateCAGR, calculateGST, calculatePPF, calculateSimpleInterest, calculateCompoundInterest, calculateHRA, calculateNPS } from './finance-utils';
import * as z from 'zod';
import { calculateDiscount, calculateROI, calculateMarkup } from './business';
import { calculateAutoLoan } from './loan-more';
import { calculateEducationLoan } from './education-loan';

export interface ToolConfig {
    calculationLogic: any;
    inputSchema: any;
    defaultValues: any;
    inputFields: {
        name: string;
        label: string;
        type: string;
        min?: number;
        max?: number;
        step?: number;
        unit: string;
        options?: { label: string; value: string }[];
    }[];
    resultMeta: {
        primaryField: string;
        primaryLabel: string;
        secondaryFields: { name: string; label: string }[];
        chartLabels: string[];
        chartDataFields: string[];
    };
}

export const TOOL_CONFIGS: Record<string, ToolConfig> = {
    'loan-emi': {
        calculationLogic: calculateLoanEMI,
        inputSchema: z.object({
            principal: z.number().min(1000).max(100000000),
            interestRate: z.number().min(0.1).max(50),
            tenure: z.number().min(1).max(50),
        }),
        defaultValues: {
            principal: 1000000,
            interestRate: 8.5,
            tenure: 20,
        },
        inputFields: [
            { name: 'principal', label: 'Principal Amount', type: 'number', min: 1000, max: 10000000, step: 10000, unit: '$' },
            { name: 'interestRate', label: 'Interest Rate (P.A.)', type: 'number', min: 0.1, max: 20, step: 0.1, unit: '%' },
            { name: 'tenure', label: 'Tenure', type: 'number', min: 1, max: 30, step: 1, unit: 'Years' },
        ],
        resultMeta: {
            primaryField: 'monthlyEMI',
            primaryLabel: 'Monthly EMI',
            secondaryFields: [
                { name: 'totalInterest', label: 'Total Interest' },
                { name: 'totalPayment', label: 'Total Payment' }
            ],
            chartLabels: ['Principal', 'Interest'],
            chartDataFields: ['principal', 'totalInterest']
        }
    },
    'sip': {
        calculationLogic: calculateSIP,
        inputSchema: z.object({
            monthlyInvestment: z.number().min(100).max(1000000),
            expectedReturnRate: z.number().min(1).max(30),
            tenure: z.number().min(1).max(40),
        }),
        defaultValues: {
            monthlyInvestment: 5000,
            expectedReturnRate: 12,
            tenure: 10,
        },
        inputFields: [
            { name: 'monthlyInvestment', label: 'Monthly Investment', type: 'number', min: 100, max: 100000, step: 500, unit: '$' },
            { name: 'expectedReturnRate', label: 'Expected Return Rate (P.A.)', type: 'number', min: 1, max: 30, step: 0.5, unit: '%' },
            { name: 'tenure', label: 'Tenure', type: 'number', min: 1, max: 40, step: 1, unit: 'Years' },
        ],
        resultMeta: {
            primaryField: 'totalAmount',
            primaryLabel: 'Total Value',
            secondaryFields: [
                { name: 'totalInvestment', label: 'Invested Amount' },
                { name: 'totalReturns', label: 'Estimated Returns' }
            ],
            chartLabels: ['Invested', 'Returns'],
            chartDataFields: ['totalInvestment', 'totalReturns']
        }
    },
    'tax': {
        calculationLogic: calculateIncomeTax,
        inputSchema: z.object({
            annualIncome: z.number().min(0).max(100000000),
            investments: z.number().min(0).max(10000000),
            otherDeductions: z.number().min(0).max(10000000),
        }),
        defaultValues: {
            annualIncome: 1200000,
            investments: 150000,
            otherDeductions: 50000,
        },
        inputFields: [
            { name: 'annualIncome', label: 'Annual Income', type: 'number', min: 0, max: 10000000, step: 10000, unit: '$' },
            { name: 'investments', label: '80C Investments', type: 'number', min: 0, max: 200000, step: 5000, unit: '$' },
            { name: 'otherDeductions', label: 'Other Deductions', type: 'number', min: 0, max: 500000, step: 5000, unit: '$' },
        ],
        resultMeta: {
            primaryField: 'netTax',
            primaryLabel: 'Net Tax Payable',
            secondaryFields: [
                { name: 'taxableIncome', label: 'Taxable Income' },
                { name: 'totalTax', label: 'Total Tax' }
            ],
            chartLabels: ['Taxable Income', 'Tax Paid'],
            chartDataFields: ['taxableIncome', 'netTax']
        }
    },
    'fd': {
        calculationLogic: calculateFD,
        inputSchema: z.object({
            depositAmount: z.number().min(500).max(100000000),
            interestRate: z.number().min(1).max(25),
            tenure: z.number().min(1).max(30),
            compoundingFrequency: z.enum(['monthly', 'quarterly', 'half-yearly', 'annually']),
        }),
        defaultValues: {
            depositAmount: 100000,
            interestRate: 6.5,
            tenure: 5,
            compoundingFrequency: 'quarterly',
        },
        inputFields: [
            { name: 'depositAmount', label: 'Deposit Amount', type: 'number', min: 1000, max: 10000000, step: 5000, unit: '$' },
            { name: 'interestRate', label: 'Interest Rate', type: 'number', min: 1, max: 20, step: 0.1, unit: '%' },
            { name: 'tenure', label: 'Tenure', type: 'number', min: 1, max: 25, step: 1, unit: 'Years' },
            {
                name: 'compoundingFrequency',
                label: 'Compounding Frequency',
                type: 'select',
                unit: 'f',
                options: [
                    { label: 'Monthly', value: 'monthly' },
                    { label: 'Quarterly', value: 'quarterly' },
                    { label: 'Half-Yearly', value: 'half-yearly' },
                    { label: 'Annually', value: 'annually' }
                ]
            },
        ],
        resultMeta: {
            primaryField: 'totalValue',
            primaryLabel: 'Maturity Value',
            secondaryFields: [
                { name: 'totalInvestment', label: 'Principal Amount' },
                { name: 'estimatedReturns', label: 'Interest Earned' }
            ],
            chartLabels: ['Principal', 'Interest'],
            chartDataFields: ['totalInvestment', 'estimatedReturns']
        }
    },
    'bmi': {
        calculationLogic: calculateBMI,
        inputSchema: z.object({
            weight: z.number().min(10).max(500),
            height: z.number().min(50).max(300),
        }),
        defaultValues: {
            weight: 70,
            height: 170,
        },
        inputFields: [
            { name: 'weight', label: 'Weight (KG)', type: 'number', min: 20, max: 200, step: 0.5, unit: 'kg' },
            { name: 'height', label: 'Height (CM)', type: 'number', min: 50, max: 250, step: 1, unit: 'cm' },
        ],
        resultMeta: {
            primaryField: 'bmi',
            primaryLabel: 'Your BMI',
            secondaryFields: [
                { name: 'category', label: 'Category' },
                { name: 'healthyWeightRange', label: 'Healthy Range' }
            ],
            chartLabels: ['Underweight', 'Normal', 'Overweight', 'Obese'],
            chartDataFields: []
        }
    },
    'retirement': {
        calculationLogic: calculateRetirement,
        inputSchema: z.object({
            currentAge: z.number().min(18).max(90),
            retirementAge: z.number().min(19).max(100),
            lifeExpectancy: z.number().min(50).max(120),
            currentSavings: z.number().min(0),
            monthlySavings: z.number().min(0),
            expectedReturn: z.number().min(1).max(20),
            inflationRate: z.number().min(0).max(15),
            requiredIncome: z.number().min(1000),
        }),
        defaultValues: {
            currentAge: 30,
            retirementAge: 60,
            lifeExpectancy: 85,
            currentSavings: 100000,
            monthlySavings: 10000,
            expectedReturn: 10,
            inflationRate: 6,
            requiredIncome: 50000,
        },
        inputFields: [
            { name: 'currentAge', label: 'Current Age', type: 'number', min: 18, max: 80, step: 1, unit: 'Yrs' },
            { name: 'retirementAge', label: 'Retirement Age', type: 'number', min: 40, max: 90, step: 1, unit: 'Yrs' },
            { name: 'lifeExpectancy', label: 'Life Expectancy', type: 'number', min: 60, max: 100, step: 1, unit: 'Yrs' },
            { name: 'currentSavings', label: 'Current Savings', type: 'number', min: 0, max: 10000000, step: 5000, unit: '$' },
            { name: 'monthlySavings', label: 'Monthly SIP', type: 'number', min: 500, max: 500000, step: 500, unit: '$' },
            { name: 'expectedReturn', label: 'Return Rate', type: 'number', min: 5, max: 20, step: 0.5, unit: '%' },
            { name: 'inflationRate', label: 'Inflation', type: 'number', min: 2, max: 12, step: 0.5, unit: '%' },
            { name: 'requiredIncome', label: 'Monthly Expenses (Today)', type: 'number', min: 5000, max: 500000, step: 1000, unit: '$' },
        ],
        resultMeta: {
            primaryField: 'shortfall',
            primaryLabel: 'Shortfall Amount',
            secondaryFields: [
                { name: 'totalCorpusNeeded', label: 'Target Corpus' },
                { name: 'projectedCorpus', label: 'Projected Corpus' },
                { name: 'monthlyIncomeAtRetirement', label: 'Monthly Need (Future)' }
            ],
            chartLabels: ['Protected', 'Shortfall'],
            chartDataFields: ['projectedCorpus', 'shortfall']
        }
    },
    'savings': {
        calculationLogic: calculateSavingsGoal,
        inputSchema: z.object({
            targetAmount: z.number().min(1000),
            currentSaved: z.number().min(0),
            years: z.number().min(1).max(50),
            interestRate: z.number().min(0.5).max(20),
        }),
        defaultValues: {
            targetAmount: 500000,
            currentSaved: 50000,
            years: 5,
            interestRate: 6,
        },
        inputFields: [
            { name: 'targetAmount', label: 'Target Amount', type: 'number', min: 1000, max: 10000000, step: 10000, unit: '$' },
            { name: 'currentSaved', label: 'Current Savings', type: 'number', min: 0, max: 5000000, step: 1000, unit: '$' },
            { name: 'years', label: 'Time Period', type: 'number', min: 1, max: 40, step: 1, unit: 'Years' },
            { name: 'interestRate', label: 'Interest Rate', type: 'number', min: 2, max: 15, step: 0.25, unit: '%' },
        ],
        resultMeta: {
            primaryField: 'monthlyInvestment',
            primaryLabel: 'Monthly Saving Needed',
            secondaryFields: [
                { name: 'totalSaved', label: 'Target Amount' }
            ],
            chartLabels: [],
            chartDataFields: []
        }
    },
    'inflation': {
        calculationLogic: calculateInflation,
        inputSchema: z.object({
            currentCost: z.number().min(100),
            inflationRate: z.number().min(0.1).max(50),
            years: z.number().min(1).max(100),
        }),
        defaultValues: {
            currentCost: 10000,
            inflationRate: 6,
            years: 10,
        },
        inputFields: [
            { name: 'currentCost', label: 'Current Cost', type: 'number', min: 100, max: 10000000, step: 500, unit: '$' },
            { name: 'inflationRate', label: 'Inflation Rate', type: 'number', min: 1, max: 20, step: 0.1, unit: '%' },
            { name: 'years', label: 'Time Period', type: 'number', min: 1, max: 50, step: 1, unit: 'Years' },
        ],
        resultMeta: {
            primaryField: 'futureCost',
            primaryLabel: 'Future Cost',
            secondaryFields: [
                { name: 'lossOfValue', label: 'Cost Increase' }
            ],
            chartLabels: [],
            chartDataFields: []
        }
    },
    'cagr': {
        calculationLogic: calculateCAGR,
        inputSchema: z.object({
            initialValue: z.number().min(1),
            finalValue: z.number().min(1),
            years: z.number().min(1).max(50),
        }),
        defaultValues: {
            initialValue: 10000,
            finalValue: 20000,
            years: 5,
        },
        inputFields: [
            { name: 'initialValue', label: 'Initial Investment', type: 'number', min: 100, max: 10000000, step: 1000, unit: '$' },
            { name: 'finalValue', label: 'Final Value', type: 'number', min: 100, max: 10000000, step: 1000, unit: '$' },
            { name: 'years', label: 'Duration', type: 'number', min: 1, max: 50, step: 1, unit: 'Years' },
        ],
        resultMeta: {
            primaryField: 'cagr',
            primaryLabel: 'CAGR (%)',
            secondaryFields: [
                { name: 'growth', label: 'Total Growth' }
            ],
            chartLabels: [],
            chartDataFields: []
        }
    },
    'gst': {
        calculationLogic: calculateGST,
        inputSchema: z.object({
            amount: z.number().min(1),
            gstRate: z.number().min(0.1).max(30),
            type: z.enum(['inclusive', 'exclusive']),
        }),
        defaultValues: {
            amount: 1000,
            gstRate: 18,
            type: 'exclusive',
        },
        inputFields: [
            { name: 'amount', label: 'Amount', type: 'number', min: 10, max: 10000000, step: 100, unit: '$' },
            { name: 'gstRate', label: 'GST Rate', type: 'number', min: 0.1, max: 28, step: 0.1, unit: '%' },
            {
                name: 'type',
                label: 'Tax Type',
                type: 'select',
                unit: '-',
                options: [
                    { label: 'GST Exclusive', value: 'exclusive' },
                    { label: 'GST Inclusive', value: 'inclusive' }
                ]
            },
        ],
        resultMeta: {
            primaryField: 'totalAmount',
            primaryLabel: 'Total Amount',
            secondaryFields: [
                { name: 'gstAmount', label: 'GST Amount' },
                { name: 'netAmount', label: 'Net Amount' }
            ],
            chartLabels: ['Net Amount', 'GST'],
            chartDataFields: ['netAmount', 'gstAmount']
        }
    },
    'ppf': {
        calculationLogic: calculatePPF,
        inputSchema: z.object({
            yearlyInvestment: z.number().min(500).max(150000),
            years: z.number().min(15).max(50),
            interestRate: z.number().min(1).max(15),
        }),
        defaultValues: {
            yearlyInvestment: 150000,
            years: 15,
            interestRate: 7.1,
        },
        inputFields: [
            { name: 'yearlyInvestment', label: 'Yearly Investment', type: 'number', min: 500, max: 150000, step: 500, unit: '$' },
            { name: 'years', label: 'Duration', type: 'number', min: 15, max: 50, step: 1, unit: 'Years' },
            { name: 'interestRate', label: 'Interest Rate', type: 'number', min: 6, max: 9, step: 0.1, unit: '%' },
        ],
        resultMeta: {
            primaryField: 'maturityAmount',
            primaryLabel: 'Maturity Amount',
            secondaryFields: [
                { name: 'totalInvestment', label: 'Total Invested' },
                { name: 'totalInterest', label: 'Interest Earned' }
            ],
            chartLabels: ['Invested', 'Interest'],
            chartDataFields: ['totalInvestment', 'totalInterest']
        }
    },
    'simple-interest': {
        calculationLogic: calculateSimpleInterest,
        inputSchema: z.object({
            principal: z.number().min(100),
            rate: z.number().min(0.1).max(50),
            time: z.number().min(1).max(100),
        }),
        defaultValues: {
            principal: 10000,
            rate: 5,
            time: 2,
        },
        inputFields: [
            { name: 'principal', label: 'Principal Amount', type: 'number', min: 1000, max: 10000000, step: 1000, unit: '$' },
            { name: 'rate', label: 'Rate of Interest (P.A.)', type: 'number', min: 0.1, max: 30, step: 0.1, unit: '%' },
            { name: 'time', label: 'Time Period', type: 'number', min: 1, max: 50, step: 1, unit: 'Years' },
        ],
        resultMeta: {
            primaryField: 'totalAmount',
            primaryLabel: 'Total Amount',
            secondaryFields: [
                { name: 'interest', label: 'Total Interest' }
            ],
            chartLabels: ['Principal', 'Interest'],
            chartDataFields: ['principal', 'interest']
        }
    },
    'compound-interest': {
        calculationLogic: calculateCompoundInterest,
        inputSchema: z.object({
            principal: z.number().min(100),
            rate: z.number().min(0.1).max(50),
            time: z.number().min(1).max(100),
            frequency: z.enum(['monthly', 'quarterly', 'half-yearly', 'annually']),
        }),
        defaultValues: {
            principal: 10000,
            rate: 5,
            time: 5,
            frequency: 'annually',
        },
        inputFields: [
            { name: 'principal', label: 'Principal Amount', type: 'number', min: 1000, max: 10000000, step: 1000, unit: '$' },
            { name: 'rate', label: 'Rate of Interest (P.A.)', type: 'number', min: 0.1, max: 30, step: 0.1, unit: '%' },
            { name: 'time', label: 'Time Period', type: 'number', min: 1, max: 50, step: 1, unit: 'Years' },
            {
                name: 'frequency',
                label: 'Compounding Frequency',
                type: 'select',
                unit: '-',
                options: [
                    { label: 'Yearly', value: 'annually' },
                    { label: 'Half-Yearly', value: 'half-yearly' },
                    { label: 'Quarterly', value: 'quarterly' },
                    { label: 'Monthly', value: 'monthly' },
                ]
            },
        ],
        resultMeta: {
            primaryField: 'totalAmount',
            primaryLabel: 'Maturity Amount',
            secondaryFields: [
                { name: 'interest', label: 'Total Interest' }
            ],
            chartLabels: ['Principal', 'Interest'],
            chartDataFields: ['principal', 'interest']
        }
    },
    'hra': {
        calculationLogic: calculateHRA,
        inputSchema: z.object({
            basicSalary: z.number().min(1000),
            da: z.number().min(0),
            hraReceived: z.number().min(0),
            rentPaid: z.number().min(0),
            cityType: z.enum(['metro', 'non-metro']),
        }),
        defaultValues: {
            basicSalary: 500000,
            da: 0,
            hraReceived: 200000,
            rentPaid: 180000,
            cityType: 'metro',
        },
        inputFields: [
            { name: 'basicSalary', label: 'Basic Salary (Yearly)', type: 'number', min: 10000, max: 10000000, step: 5000, unit: '$' },
            { name: 'da', label: 'Dearness Allowance (yearly)', type: 'number', min: 0, max: 5000000, step: 5000, unit: '$' },
            { name: 'hraReceived', label: 'HRA Received (Yearly)', type: 'number', min: 0, max: 5000000, step: 5000, unit: '$' },
            { name: 'rentPaid', label: 'Total Rent Paid (Yearly)', type: 'number', min: 0, max: 5000000, step: 5000, unit: '$' },
            {
                name: 'cityType',
                label: 'City Type',
                type: 'select',
                unit: '-',
                options: [
                    { label: 'Metro (Delhi, Mumbai, Kolkata, Chennai)', value: 'metro' },
                    { label: 'Non-Metro', value: 'non-metro' },
                ]
            },
        ],
        resultMeta: {
            primaryField: 'exemptHRA',
            primaryLabel: 'Exempt HRA',
            secondaryFields: [
                { name: 'taxableHRA', label: 'Taxable HRA' }
            ],
            chartLabels: ['Exempt', 'Taxable'],
            chartDataFields: ['exemptHRA', 'taxableHRA']
        }
    },
    'nps': {
        calculationLogic: calculateNPS,
        inputSchema: z.object({
            monthlyInvestment: z.number().min(500),
            currentAge: z.number().min(18).max(60),
            retirementAge: z.number().min(19).max(75),
            expectedReturn: z.number().min(1).max(20),
        }),
        defaultValues: {
            monthlyInvestment: 5000,
            currentAge: 25,
            retirementAge: 60,
            expectedReturn: 10,
        },
        inputFields: [
            { name: 'monthlyInvestment', label: 'Monthly Investment', type: 'number', min: 500, max: 100000, step: 500, unit: '$' },
            { name: 'currentAge', label: 'Current Age', type: 'number', min: 18, max: 60, step: 1, unit: 'Yrs' },
            { name: 'retirementAge', label: 'Retirement Age', type: 'number', min: 40, max: 70, step: 1, unit: 'Yrs' },
            { name: 'expectedReturn', label: 'Expected Return', type: 'number', min: 5, max: 15, step: 0.5, unit: '%' },
        ],
        resultMeta: {
            primaryField: 'totalCorpus',
            primaryLabel: 'Total Pension Wealth',
            secondaryFields: [
                { name: 'totalInvestment', label: 'Principal Invested' },
                { name: 'totalInterest', label: 'Interest Earned' }
            ],
            chartLabels: ['Principal', 'Interest'],
            chartDataFields: ['totalInvestment', 'totalInterest']
        }
    },
    'discount': {
        calculationLogic: calculateDiscount,
        inputSchema: z.object({
            originalPrice: z.number().min(1),
            discountType: z.enum(['percentage', 'fixed']),
            discountValue: z.number().min(0),
        }),
        defaultValues: {
            originalPrice: 1000,
            discountType: 'percentage',
            discountValue: 10,
        },
        inputFields: [
            { name: 'originalPrice', label: 'Original Price', type: 'number', min: 1, max: 1000000, step: 100, unit: '$' },
            {
                name: 'discountType',
                label: 'Discount Type',
                type: 'select',
                unit: '-',
                options: [
                    { label: 'Percentage (%)', value: 'percentage' },
                    { label: 'Fixed Amount ($)', value: 'fixed' }
                ]
            },
            { name: 'discountValue', label: 'Discount Value', type: 'number', min: 0, max: 100000, step: 5, unit: ' ' },
        ],
        resultMeta: {
            primaryField: 'finalPrice',
            primaryLabel: 'Final Price',
            secondaryFields: [
                { name: 'savedAmount', label: 'You Save' }
            ],
            chartLabels: ['Payable', 'Saved'],
            chartDataFields: ['finalPrice', 'savedAmount']
        }
    },
    'roi': {
        calculationLogic: calculateROI,
        inputSchema: z.object({
            initialInvestment: z.number().min(1),
            finalValue: z.number().min(0),
            expenses: z.number().min(0),
        }),
        defaultValues: {
            initialInvestment: 10000,
            finalValue: 15000,
            expenses: 500,
        },
        inputFields: [
            { name: 'initialInvestment', label: 'Initial Investment', type: 'number', min: 100, max: 10000000, step: 1000, unit: '$' },
            { name: 'finalValue', label: 'Final Value', type: 'number', min: 0, max: 10000000, step: 1000, unit: '$' },
            { name: 'expenses', label: 'Expenses', type: 'number', min: 0, max: 100000, step: 100, unit: '$' },
        ],
        resultMeta: {
            primaryField: 'roi',
            primaryLabel: 'ROI (%)',
            secondaryFields: [
                { name: 'netProfit', label: 'Net Profit' }
            ],
            chartLabels: ['Investment', 'Profit', 'Expenses'],
            chartDataFields: ['initialInvestment', 'netProfit', 'expenses'] // Note: chart logic depends on implementation, usually we just show breakdown.
        }
    },
    'markup': {
        calculationLogic: calculateMarkup,
        inputSchema: z.object({
            costPrice: z.number().min(1),
            markupPercentage: z.number().min(0),
        }),
        defaultValues: {
            costPrice: 100,
            markupPercentage: 20,
        },
        inputFields: [
            { name: 'costPrice', label: 'Cost Price', type: 'number', min: 1, max: 1000000, step: 10, unit: '$' },
            { name: 'markupPercentage', label: 'Markup', type: 'number', min: 0, max: 500, step: 5, unit: '%' },
        ],
        resultMeta: {
            primaryField: 'sellingPrice',
            primaryLabel: 'Selling Price',
            secondaryFields: [
                { name: 'grossProfit', label: 'Gross Profit' }
            ],
            chartLabels: ['Cost', 'Profit'],
            chartDataFields: ['costPrice', 'grossProfit']
        }
    },
    'education-loan': {
        calculationLogic: calculateEducationLoan,
        inputSchema: z.object({
            loanAmount: z.number().min(1000).max(100000000),
            interestRate: z.number().min(0.1).max(30),
            tenure: z.number().min(1).max(30),
            moratoriumPeriod: z.number().min(0).max(60).optional(),
        }),
        defaultValues: {
            loanAmount: 1000000,
            interestRate: 8.5,
            tenure: 10,
            moratoriumPeriod: 0,
        },
        inputFields: [
            { name: 'loanAmount', label: 'Loan Amount', type: 'number', min: 10000, max: 20000000, step: 10000, unit: '₹' },
            { name: 'interestRate', label: 'Interest Rate', type: 'number', min: 1, max: 20, step: 0.1, unit: '%' },
            { name: 'tenure', label: 'Repayment Tenure', type: 'number', min: 1, max: 20, step: 1, unit: 'Years' },
            { name: 'moratoriumPeriod', label: 'Moratorium (Month)', type: 'number', min: 0, max: 60, step: 6, unit: 'Mos' },
        ],
        resultMeta: {
            primaryField: 'emi',
            primaryLabel: 'Monthly EMI',
            secondaryFields: [
                { name: 'totalInterest', label: 'Total Interest' },
                { name: 'totalPayment', label: 'Total Payment' },
                { name: 'effectivePrincipal', label: 'Principal + Moratorium Int.' }
            ],
            chartLabels: ['Principal', 'Interest'],
            chartDataFields: ['effectivePrincipal', 'totalInterest']
        }
    },
    'auto-loan': {
        calculationLogic: calculateAutoLoan,
        inputSchema: z.object({
            vehiclePrice: z.number().min(1000),
            downPayment: z.number().min(0),
            tradeInValue: z.number().min(0),
            interestRate: z.number().min(0.1),
            loanTerm: z.number().min(12).max(96),
            salesTax: z.number().min(0).max(20),
        }),
        defaultValues: {
            vehiclePrice: 30000,
            downPayment: 5000,
            tradeInValue: 0,
            interestRate: 5,
            loanTerm: 60, // 5 years
            salesTax: 0,
        },
        inputFields: [
            { name: 'vehiclePrice', label: 'Vehicle Price', type: 'number', min: 1000, max: 200000, step: 1000, unit: '$' },
            { name: 'downPayment', label: 'Down Payment', type: 'number', min: 0, max: 100000, step: 500, unit: '$' },
            { name: 'tradeInValue', label: 'Trade-In Value', type: 'number', min: 0, max: 100000, step: 500, unit: '$' },
            { name: 'interestRate', label: 'Interest Rate', type: 'number', min: 0.1, max: 30, step: 0.1, unit: '%' },
            { name: 'loanTerm', label: 'Loan Term (Months)', type: 'number', min: 12, max: 96, step: 12, unit: 'Mos' },
            { name: 'salesTax', label: 'Sales Tax', type: 'number', min: 0, max: 20, step: 0.1, unit: '%' },
        ],
        resultMeta: {
            primaryField: 'monthlyPayment',
            primaryLabel: 'Monthly Payment',
            secondaryFields: [
                { name: 'totalInterest', label: 'Total Interest' },
                { name: 'totalPayment', label: 'Total Payment' }
            ],
            chartLabels: ['Loan Amount', 'Total Interest'],
            chartDataFields: ['loanAmount', 'totalInterest']
        }
    }
};
