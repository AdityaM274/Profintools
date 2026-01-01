export interface BMIInputs {
    weight: number; // in kg
    height: number; // in cm
}

export interface BMIResult {
    bmi: number;
    category: string;
    healthyWeightRange: string;
}

export function calculateBMI(inputs: BMIInputs): BMIResult {
    const { weight, height } = inputs;
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal weight';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';

    const lowWeight = 18.5 * (heightInMeters * heightInMeters);
    const highWeight = 24.9 * (heightInMeters * heightInMeters);

    return {
        bmi: parseFloat(bmi.toFixed(1)),
        category,
        healthyWeightRange: `${lowWeight.toFixed(1)}kg - ${highWeight.toFixed(1)}kg`
    };
}
