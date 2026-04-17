import React from "react";
import BackButton from "../components/shared/BackButton";

const TermsOfUse: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#fef5ea] flex flex-col items-center py-10 px-5">
            <div className="w-full max-w-3xl bg-white rounded-[25px] p-8 shadow-sm">
                <div className="mb-6">
                    <BackButton />
                </div>
                <h1 className="font-['Syne',sans-serif] font-bold text-3xl mb-6 text-black border-b border-[#f49b31] pb-4">
                    Terms of Use
                </h1>
                
                <div className="font-['Poppins',sans-serif] text-[#454545] space-y-6 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold mb-2">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using Echo ("the Platform"), you agree to abide by these Terms of Use. If you do not agree, please do not use our services. We reserve the right to update these terms at any time without prior notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-2">2. User Conduct</h2>
                        <p>
                            You agree to use Echo solely for lawful purposes. Harassment, hate speech, spammed content, and the violation of any intellectual property rights are strictly prohibited. Users found violating these guidelines may be temporarily or permanently suspended.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-2">3. Content Ownership and Anonymity</h2>
                        <p>
                            While you retain ownership over the content you publish, by posting on Echo you grant us a non-exclusive license to display, distribute, and reproduce the content within the platform. Pseudonymous / anonymous posting features are provided to protect user identity, but they do not shield users from moderation against abuse.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-2">4. Disclaimers</h2>
                        <p>
                            Echo provides a platform for organizational feedback and issue tracking "as is". We make no warranties regarding the accuracy of user-generated content or the platform's uninterrupted availability.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-2">5. Contact</h2>
                        <p>
                            For inquiries concerning these Terms of Use, please reach out to contact@echo-ng.com.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsOfUse;
