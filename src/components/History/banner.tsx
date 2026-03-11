import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SoundBoardHeader = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="relative w-full h-[200px] bg-black overflow-hidden">
            {/* Noise Texture Overlay */}
            <div
                className="absolute inset-0 opacity-[0.08] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                }}
            />

            {/* Animated Circles Container */}
            <div className="absolute inset-0 flex items-center justify-center">

                {/* Circle 4 */}
                <motion.div
                    className="absolute w-[600px] h-[300px] rounded-[50%] ripple-backdrop"
                    style={{
                        top: '25%',
                    }}
                    initial={{ y: 0, opacity: 1, filter: 'blur(16px)' }}
                    animate={mounted ? {
                        y: -80,
                        filter: 'blur(32px)',
                        opacity: 0,
                        height: '400px',
                        width: '800px'
                    } : {}}
                    transition={{
                        duration: 2,
                        ease: 'easeInOut',
                        repeat: Infinity
                    }}
                />

                {/* Circle 3  */}
                <motion.div
                    className="absolute w-[400px] h-[200px] rounded-[50%] ripple-backdrop"
                    style={{
                        top: '45%',
                    }}
                    initial={{ y: 0, filter: 'blur(5px)', opacity: 1 }}
                    animate={mounted ? {
                        y: -50,
                        filter: 'blur(16px)',
                        opacity: 1,
                        height: '300px',
                        width: '600px'
                    } : {}}
                    transition={{
                        duration: 2,
                        ease: 'easeInOut',
                        repeat: Infinity
                    }}
                />

                {/* Circle 2 */}
                <motion.div
                    className="absolute w-[280px] h-[140px] rounded-[50%] ripple-backdrop"
                    style={{
                        top: '72%',
                    }}
                    initial={{ y: 0, filter: 'blur(0px)', opacity: 1 }}
                    animate={mounted ? {
                        y: -45,
                        filter: 'blur(6px)',
                        opacity: 1,
                        height: '200px',
                        width: '400px'
                    } : {}}
                    transition={{
                        duration: 2,
                        ease: 'easeInOut',
                        repeat: Infinity
                    }}
                />

                {/* Circle 1 */}
                <motion.div
                    className="absolute w-[100px] h-[50px] rounded-[50%] ripple-backdrop"
                    style={{
                        top: '100%',
                    }}
                    initial={{ y: 0, opacity: 1 }}
                    animate={mounted ? {
                        y: -55,
                        opacity: 1,
                        height: '140px',
                        width: '280px'
                    } : {}}
                    transition={{
                        duration: 2,
                        ease: 'easeInOut',
                        repeat: Infinity
                    }}
                />

                {/* Ambient glow underneath */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px]"
                    style={{
                        filter: 'blur(60px)',
                    }}
                >
                    <div className="w-full h-full rounded-[50%] bg-gradient-radial from-orange-500/20 via-orange-600/10 to-transparent" />
                </div>
            </div>

            {/* Text Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
                <h1 className="text-3xl md:text-4xl font-semibold text-white text-center mb-2">
                    Welcome to the Soundboard
                </h1>
                <p className="text-base md:text-xl font-medium text-[#dadada] text-center">
                    Post problems. Propose solutions. Surge change.
                </p>
            </div>
        </div>
    );
};

export default SoundBoardHeader;
