
// DISCOUNT CALCULATOR
export function calculateDiscount(inputs: { originalPrice: number; discountType: 'percentage' | 'fixed'; discountValue: number }) {
    const { originalPrice, discountType, discountValue } = inputs;
    let discountAmount = 0;

    if (discountType === 'percentage') {
        discountAmount = (originalPrice * discountValue) / 100;
    } else {
        discountAmount = discountValue;
    }

    const finalPrice = Math.max(0, originalPrice - discountAmount);
    return { finalPrice, savedAmount: discountAmount };
}

// ROI CALCULATOR
export function calculateROI(inputs: { initialInvestment: number; finalValue: number; expenses: number }) {
    const { initialInvestment, finalValue, expenses } = inputs;
    const netProfit = finalValue - initialInvestment - expenses;
    const roi = (netProfit / initialInvestment) * 100;
    return { roi, netProfit };
}

// MARKUP CALCULATOR
export function calculateMarkup(inputs: { costPrice: number; markupPercentage: number }) {
    const { costPrice, markupPercentage } = inputs;
    const markupAmount = (costPrice * markupPercentage) / 100;
    const sellingPrice = costPrice + markupAmount;
    const grossProfit = sellingPrice - costPrice; // Same as markup amount in this simple case
    return { sellingPrice, grossProfit };
}
