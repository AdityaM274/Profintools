import React from 'react';
import { FileText, CheckCircle } from 'lucide-react';

export default function TermsOfService() {
    return (
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-20 animate-fade-in">
            <h1 className="text-4xl font-extrabold mb-4 font-black">Terms of Service</h1>
            <p className="text-secondary mb-12">Last Updated: January 1, 2026</p>

            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <FileText className="w-6 h-6 text-primary" /> 1. Acceptance of Terms
                    </h2>
                    <p className="text-secondary leading-relaxed">
                        By accessing and using ProFinTools, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-primary" /> 2. Accuracy of Information
                    </h2>
                    <p className="text-secondary leading-relaxed mb-4">
                        While we strive for 100% accuracy in our calculations, ProFinTools provides tools for informational purposes only. Results should not be considered financial or legal advice.
                    </p>
                    <div className="p-4 bg-red-500/10 border-l-4 border-red-500 rounded text-sm text-secondary">
                        <strong>Disclaimer:</strong> Always consult with a qualified financial advisor before making significant financial decisions.
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-primary" /> 3. User Conduct
                    </h2>
                    <p className="text-secondary leading-relaxed">
                        You agree to use our tools for lawful purposes only. You may not attempt to reverse engineer our algorithms or scrape data from our platform without express permission.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-primary" /> 4. Premium Subscriptions
                    </h2>
                    <p className="text-secondary leading-relaxed">
                        Premium subscriptions provide ad-free access and additional features. Payments are processed via Stripe and are non-refundable after 30 days unless otherwise stated.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-primary" /> 5. Limitation of Liability
                    </h2>
                    <p className="text-secondary leading-relaxed">
                        ProFinTools shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our tools.
                    </p>
                </section>
            </div>
        </div>
    );
}
