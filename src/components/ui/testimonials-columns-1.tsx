"use client";
import React from "react";
import { motion } from "motion/react";

export interface Testimonial {
    text: string;
    image: string;
    name: string;
    role: string;
}

export const TestimonialsColumn = (props: {
    className?: string;
    testimonials: Testimonial[];
    duration?: number;
}) => {
    return (
        <div className={props.className}>
            <motion.div
                animate={{
                    translateY: "-50%",
                }}
                transition={{
                    duration: props.duration || 10,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop",
                }}
                className="flex flex-col gap-6 pb-6 bg-background"
            >
                {[
                    ...new Array(2).fill(0).map((_, index) => (
                        <React.Fragment key={index}>
                            {props.testimonials.map(({ text, image, name, role }, i) => (
                                <div className="p-8 rounded-2xl border border-gray-100 shadow-sm bg-white hover:shadow-md transition-shadow max-w-xs w-full" key={i}>
                                    <div className="text-gray-600 text-sm leading-relaxed mb-6 font-light italic">"{text}"</div>
                                    <div className="flex items-center gap-3">
                                        <img
                                            width={40}
                                            height={40}
                                            src={image}
                                            alt={name}
                                            className="h-10 w-10 rounded-full object-cover grayscale opacity-80"
                                        />
                                        <div className="flex flex-col">
                                            <div className="font-serif font-bold text-sm tracking-wide uppercase text-black">{name}</div>
                                            <div className="text-xs text-gray-400 tracking-wider uppercase">{role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </React.Fragment>
                    )),
                ]}
            </motion.div>
        </div>
    );
};
