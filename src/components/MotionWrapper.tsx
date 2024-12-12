// components/MotionWrapper.tsx
"use client"
import { motion } from 'framer-motion';
import React from 'react';
import { usePathname } from 'next/navigation';

interface MotionWrapperProps {
    children: React.ReactNode;
    animation?: object;
}

const MotionWrapper: React.FC<MotionWrapperProps> = ({ children, animation }) => {
    const pathname = usePathname();

    const isHomePage = pathname === '/';

    const defaultAnimation = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
    };

    const appliedAnimation = animation || defaultAnimation;

    // Apply animation only if it's the homepage
    if (isHomePage) {
        return (
            <motion.div {...appliedAnimation}>
                {children}
            </motion.div>
        );
    }

    // No animation, just return the children
    return (
        <div>
            {children}
        </div>
    );
};

export default MotionWrapper;
