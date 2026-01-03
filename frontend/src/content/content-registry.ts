import dynamic from 'next/dynamic';
import React from 'react';

// Dynamic imports to split bundle
const EducationLoanContent = dynamic(() => import('./tools/education-loan'));

// Map slug to content component
export const TOOL_CONTENT_REGISTRY: Record<string, React.ComponentType<any>> = {
    'education-loan-emi-calculator': EducationLoanContent,
};
