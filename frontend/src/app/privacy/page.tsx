import React from 'react';
import { ShieldCheck, Eye, Lock, Globe } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-20 animate-fade-in">
            <h1 className="text-4xl font-extrabold mb-4">Privacy Policy</h1>
            <p className="text-secondary mb-12">Last Updated: January 1, 2026</p>

            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-primary" /> 1. Commitment to Privacy
                    </h2>
                    <p className="text-secondary leading-relaxed">
                        At ProFinTools, your privacy is our top priority. We've designed our platform to be "Privacy-First," meaning we minimize data collection and prioritize local browser-based processing whenever possible.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Eye className="w-6 h-6 text-primary" /> 2. Data We Collect
                    </h2>
                    <p className="text-secondary leading-relaxed mb-4">
                        We collect minimal personal information, which may include:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-secondary">
                        <li><strong>Account Information:</strong> Email and preference if you create an account.</li>
                        <li><strong>Usage Data:</strong> Anonymous statistics like page views to improve our tools.</li>
                        <li><strong>Cookies:</strong> Essential cookies for authentication and performance.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Lock className="w-6 h-6 text-primary" /> 3. How We Use Data
                    </h2>
                    <p className="text-secondary leading-relaxed">
                        Your data is used solely to provide and improve your experience on ProFinTools. We never sell your personal information to third parties. Financial inputs entered into our calculators are processed locally in your browser and are not sent to our servers unless you explicitly save them to your account.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Globe className="w-6 h-6 text-primary" /> 4. Security
                    </h2>
                    <p className="text-secondary leading-relaxed">
                        We use industry-standard encryption (SSL/TLS) to protect data transmitted to and from our site. Our databases are secured with multi-layer authentication and periodic security audits.
                    </p>
                </section>

                <div className="glass-card p-6 border-primary/20 bg-primary/5 italic text-sm text-secondary">
                    "Privacy is not an option, and it shouldn't be the price we accept for just getting on the internet." — ProFinTools Ethics Code
                </div>
            </div>
        </div>
    );
}
