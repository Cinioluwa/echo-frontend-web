/**
 * HistoryBanner
 * Figma ref: 4183:13534 (desktop), 4183:13523 (mobile)
 * Phase: 4
 *
 * Hero gradient banner at the top of the History page.
 * Dark background with an orange/red glowing sphere illustration,
 * centered "History" title, and subtitle text.
 * Desktop: h-[257px], Mobile: h-[111px] with rounded-[8px]
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';


const HistoryBanner = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div
            className="relative w-full overflow-hidden md:rounded-none rounded-lg max-w-full"
            style={{ height: "unset" }}
        >
            {/* Desktop size */}
            <div className="hidden md:block h-[257px] relative bg-black overflow-hidden w-full">
                {/* Animated Circles Container */}
                <div className="absolute inset-0 flex items-center justify-center">

                    {/* Circle 4 */}
                    <motion.div
                        className="absolute w-[600px] h-[300px] rounded-[50%] ripple-backdrop"
                        initial={{ y: 72, opacity: 1, filter: 'blur(16px)' }}
                        animate={mounted ? {
                            y: 62,
                            filter: 'blur(32px)',
                            opacity: 0,
                            height: '400px',
                            width: '800px'
                        } : {}}
                        transition={{
                            duration: 1.2,
                            ease: 'easeInOut',
                            repeat: Infinity
                        }}
                    />

                    {/* Circle 3  */}
                    <motion.div
                        className="absolute w-[400px] h-[200px] rounded-[50%] ripple-backdrop"
                        initial={{ y: 82, filter: 'blur(5px)', opacity: 1 }}
                        animate={mounted ? {
                            y: 72,
                            filter: 'blur(16px)',
                            opacity: 1,
                            height: '300px',
                            width: '600px'
                        } : {}}
                        transition={{
                            duration: 1.2,
                            ease: 'easeInOut',
                            repeat: Infinity
                        }}
                    />

                    {/* Circle 2 */}
                    <motion.div
                        className="absolute w-[280px] h-[140px] rounded-[50%] ripple-backdrop"
                        initial={{ y: 127, filter: 'blur(0px)', opacity: 1 }}
                        animate={mounted ? {
                            y: 82,
                            filter: 'blur(6px)',
                            opacity: 1,
                            height: '200px',
                            width: '400px'
                        } : {}}
                        transition={{
                            duration: 1.2,
                            ease: 'easeInOut',
                            repeat: Infinity
                        }}
                    />

                    {/* Circle 1 */}
                    <motion.div
                        className="absolute w-[100px] h-[50px] rounded-[50%] ripple-backdrop"
                        initial={{ y: 200, opacity: 1 }}
                        animate={mounted ? {
                            y: 127,
                            opacity: 1,
                            height: '140px',
                            width: '280px'
                        } : {}}
                        transition={{
                            duration: 1.2,
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
                {/* Noise texture overlay */}
                <div
                    className="absolute inset-0 opacity-[0.08] pointer-events-none"
                    style={{
                        backgroundImage:
                            "url('data:image/svg+xml,%3Csvg viewBox%3D%220 0 256 256%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter id%3D%22noise%22%3E%3CfeTurbulence type%3D%22fractalNoise%22 baseFrequency%3D%220.9%22 numOctaves%3D%224%22 stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect width%3D%22100%25%22 height%3D%22100%25%22 filter%3D%22url(%23noise)%22%2F%3E%3C%2Fsvg%3E')",
                        backgroundSize: "200px 200px",
                    }}
                />
                {/* Text content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full gap-2">
                    <h1
                        className="font-['Poppins',sans-serif] font-semibold text-[40px] text-white text-center leading-normal"
                    >
                        History
                    </h1>
                    <p
                        className="font-['Poppins',sans-serif] font-medium text-[20px] text-[#dadada] text-center leading-normal"
                    >
                        See all the problems you&apos;ve posted, solutions proposed and surges made.
                    </p>
                </div>
            </div>

            {/* Mobile size */}
            <div className="md:hidden h-[111px] relative bg-black overflow-hidden w-full rounded-lg">
                {/* Animated Circles Container */}
                <div className="absolute inset-0 flex items-center justify-center">

                    {/* Circle 4 */}
                    <motion.div
                        className="absolute w-[300px] h-[150px] rounded-[50%] ripple-backdrop"
                        initial={{ y: 72 - 42, opacity: 1, filter: 'blur(16px)' }}
                        animate={mounted ? {
                            y: 62 - 42,
                            filter: 'blur(32px)',
                            opacity: 0,
                            height: '200px',
                            width: '400px'
                        } : {}}
                        transition={{
                            duration: 1.2,
                            ease: 'easeInOut',
                            repeat: Infinity
                        }}
                    />

                    {/* Circle 3  */}
                    <motion.div
                        className="absolute w-[200px] h-[100px] rounded-[50%] ripple-backdrop"
                        initial={{ y: 82 - 42, filter: 'blur(5px)', opacity: 1 }}
                        animate={mounted ? {
                            y: 72 - 42,
                            filter: 'blur(16px)',
                            opacity: 1,
                            height: '150px',
                            width: '300px'
                        } : {}}
                        transition={{
                            duration: 1.2,
                            ease: 'easeInOut',
                            repeat: Infinity
                        }}
                    />

                    {/* Circle 2 */}
                    <motion.div
                        className="absolute w-[140px] h-[70px] rounded-[50%] ripple-backdrop"
                        initial={{ y: 97 - 42, filter: 'blur(0px)', opacity: 1 }}
                        animate={mounted ? {
                            y: 82 - 42,
                            filter: 'blur(6px)',
                            opacity: 1,
                            height: '100px',
                            width: '200px'
                        } : {}}
                        transition={{
                            duration: 1.2,
                            ease: 'easeInOut',
                            repeat: Infinity
                        }}
                    />

                    {/* Circle 1 */}
                    <motion.div
                        className="absolute w-[50px] h-[25px] rounded-[50%] ripple-backdrop"
                        initial={{ y: 120 - 42, opacity: 1 }}
                        animate={mounted ? {
                            y: 97 - 42,
                            opacity: 1,
                            height: '70px',
                            width: '140px'
                        } : {}}
                        transition={{
                            duration: 1.2,
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
                {/* Text content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full gap-1">
                    <h1
                        className="font-['Poppins',sans-serif] font-semibold text-[20px] text-white text-center leading-normal"
                    >
                        History
                    </h1>
                    <p
                        className="font-['Poppins',sans-serif] font-medium text-[10px] text-[#dadada] text-center leading-normal"
                    >
                        See all the problems you&apos;ve posted, solutions proposed and surges made.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HistoryBanner;
