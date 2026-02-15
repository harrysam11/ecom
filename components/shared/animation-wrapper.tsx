"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface FadeInProps {
    children: ReactNode
    delay?: number
    direction?: "up" | "down" | "left" | "right" | "none"
    duration?: number
    className?: string
}

export function FadeIn({
    children,
    delay = 0,
    direction = "none",
    duration = 0.5,
    className = "",
}: FadeInProps) {
    const directions = {
        up: { y: 20 },
        down: { y: -20 },
        left: { x: 20 },
        right: { x: -20 },
        none: { x: 0, y: 0 },
    }

    return (
        <motion.div
            initial={{
                opacity: 0,
                ...directions[direction],
            }}
            whileInView={{
                opacity: 1,
                x: 0,
                y: 0,
            }}
            viewport={{ once: true }}
            transition={{
                duration,
                delay,
                ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export function StaggerContainer({
    children,
    delayChildren = 0,
    staggerChildren = 0.1,
    className = "",
}: {
    children: ReactNode
    delayChildren?: number
    staggerChildren?: number
    className?: string
}) {
    return (
        <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
                hidden: {},
                show: {
                    transition: {
                        delayChildren,
                        staggerChildren,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
