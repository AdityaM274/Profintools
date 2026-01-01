export interface Tool {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    category: string;
    featured?: boolean;
}

export const CATEGORIES = [
    'Personal Finance',
    'Loans & Credit',
    'Investments',
    'Taxes',
    'Business',
    'Others'
];

export const TOOLS: Tool[] = [
    {
        id: 'loan-emi',
        name: 'Loan EMI Calculator',
        slug: 'loan-emi-calculator',
        description: 'Calculate your monthly loan repayments with interest and principal breakdown.',
        icon: 'Calculator',
        category: 'Loans & Credit',
        featured: true
    },
    {
        id: 'sip',
        name: 'SIP Calculator',
        slug: 'sip-calculator',
        description: 'Estimate the returns on your Systematic Investment Plan (SIP) over time.',
        icon: 'TrendingUp',
        category: 'Investments',
        featured: true
    },
    {
        id: 'tax',
        name: 'Income Tax Calculator',
        slug: 'income-tax-calculator',
        description: 'Calculate your annual income tax based on latest tax slabs.',
        icon: 'FileText',
        category: 'Taxes',
        featured: true
    },
    {
        id: 'fd',
        name: 'Fixed Deposit Calculator',
        slug: 'fd-calculator',
        description: 'Calculate the maturity amount of your fixed deposit investments.',
        icon: 'PiggyBank',
        category: 'Investments'
    },
    {
        id: 'bmi',
        name: 'BMI Calculator',
        slug: 'bmi-calculator',
        description: 'Body Mass Index calculator for your health tracking.',
        icon: 'Activity',
        category: 'Others'
    },
    {
        id: 'retirement',
        name: 'Retirement Planner',
        slug: 'retirement-planner',
        description: 'Plan your retirement savings and see how long your money will last.',
        icon: 'TrendingUp',
        category: 'Personal Finance',
        featured: true
    },
    {
        id: 'savings',
        name: 'Savings Goal Calculator',
        slug: 'savings-goal-calculator',
        description: 'Calculate how much you need to save to reach your target goal.',
        icon: 'PiggyBank',
        category: 'Personal Finance'
    },
    {
        id: 'inflation',
        name: 'Inflation Calculator',
        slug: 'inflation-calculator',
        description: 'See how inflation affects your purchasing power over time.',
        icon: 'TrendingUp',
        category: 'Others'
    },
    {
        id: 'cagr',
        name: 'CAGR Calculator',
        slug: 'cagr-calculator',
        description: 'Calculate the Compound Annual Growth Rate of your investments.',
        icon: 'TrendingUp',
        category: 'Investments'
    },
    {
        id: 'gst',
        name: 'GST Calculator',
        slug: 'gst-calculator',
        description: 'Calculate Goods and Services Tax (GST) for your business.',
        icon: 'FileText',
        category: 'Business'
    },
    {
        id: 'ppf',
        name: 'PPF Calculator',
        slug: 'ppf-calculator',
        description: 'Calculate returns on your Public Provident Fund (PPF) investment.',
        icon: 'PiggyBank',
        category: 'Investments'
    },
    {
        id: 'simple-interest',
        name: 'Simple Interest Calculator',
        slug: 'simple-interest-calculator',
        description: 'Calculate the simple interest on your loans or savings.',
        icon: 'Calculator',
        category: 'Personal Finance'
    },
    {
        id: 'compound-interest',
        name: 'Compound Interest Calculator',
        slug: 'compound-interest-calculator',
        description: 'Calculate the compound interest on your investments.',
        icon: 'TrendingUp',
        category: 'Investments'
    },
    {
        id: 'hra',
        name: 'HRA Calculator',
        slug: 'hra-calculator',
        description: 'Calculate your House Rent Allowance exemption.',
        icon: 'FileText',
        category: 'Taxes'
    },
    {
        id: 'nps',
        name: 'NPS Calculator',
        slug: 'nps-calculator',
        description: 'Estimate your pension and lump sum amount from National Pension System.',
        icon: 'ShieldCheck',
        category: 'Retirement'
    }
];
