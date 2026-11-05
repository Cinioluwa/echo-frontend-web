import React from "react";
import BackButton from "../components/shared/BackButton";

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#fef5ea] flex flex-col items-center py-10 px-5">
            <div className="w-full max-w-3xl bg-white rounded-[25px] p-8 shadow-sm">
                <div className="mb-6">
                    <BackButton />
                </div>
                <h1 className="font-['Syne',sans-serif] font-bold text-3xl mb-6 text-black border-b border-[#f49b31] pb-4">
                    Privacy Policy
                </h1>
                
                <div className="font-['Poppins',sans-serif] text-[#454545] space-y-6 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold mb-2">1. Information We Collect</h2>
                        <p>
                            When you register, we may collect your name, email address, profile photo, and institutional affiliation. We also collect usage data—such as your posts, comments, and interactions—to maintain the core functionality of the community issue tracker.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-2">2. How We Use Your Information</h2>
                        <p>
                            We use your data strictly to provide, maintain, and improve the Echo platform. This includes authenticating you during sign in, notifying leaders within your organization, and moderating content reported by the community.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-2">3. Anonymity Operations</h2>
                        <p>
                            Echo limits the exposure of your identity when using the "Anonymous/Pseudonymous" posting feature. During anonymous posts, your real name and avatar are decoupled from your content on the public feed. However, we retain an encrypted internal mapping to enforce moderation and prevent abuse.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-2">4. Data Security</h2>
                        <p>
                            We implement industry-standard security measures to safeguard your personal information against unauthorized access, alteration, or destruction. We do not sell or rent your personal information to third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-2">5. Updates to this Policy</h2>
                        <p>
                            This Privacy Policy may be updated periodically to reflect changes in our practices. We will notify you of any significant shifts through the platform.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
