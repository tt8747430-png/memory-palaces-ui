import {motion} from "motion/react";

export function AmbientParticles() {
    const particles = Array.from({length: 12}, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 0.6,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full"
                    initial={{opacity: 0}}
                    animate={{opacity: 0.4}}
                    transition={{
                        duration: 0.8,
                        delay: particle.delay,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        background:
                            "radial-gradient(circle, rgba(173, 200, 255, 0.6) 0%, rgba(173, 200, 255, 0.2) 70%, transparent 100%)",
                        filter: "blur(0.5px)",
                    }}
                />
            ))}
        </div>
    );
}
