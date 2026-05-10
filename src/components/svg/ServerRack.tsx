"use client";

import { motion } from "motion/react";

interface LedProps {
  cx: number;
  cy: number;
  color: string;
  delay: number;
}

function Led({ cx, cy, color, delay }: LedProps) {
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={3}
      fill={color}
      filter="url(#led-glow)"
      animate={{ opacity: [1, 0.25, 1] }}
      transition={{ duration: 1.4 + delay * 0.3, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

interface RackUnitProps {
  y: number;
  label: string;
  delay: number;
}

function RackUnit({ y, label, delay }: RackUnitProps) {
  const leds = [
    { color: "#00FF88", delay: 0.0 },
    { color: "#00D4FF", delay: 0.4 },
    { color: "#00FF88", delay: 0.8 },
    { color: "#FFB347", delay: 1.2 },
  ];

  return (
    <motion.g
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay }}
    >
      {/* Rack body */}
      <rect x={60} y={y} width={260} height={64} rx={3} fill="#0A1628" stroke="#1A2E4A" strokeWidth={1} />
      {/* Drive bay lines */}
      {[12, 24, 36, 48].map((dy) => (
        <line key={dy} x1={72} y1={y + dy} x2={260} y2={y + dy} stroke="#1A2E4A" strokeWidth={0.5} />
      ))}
      {/* Label */}
      <text x={72} y={y + 37} fill="#3A4A6B" fontFamily="JetBrains Mono, monospace" fontSize={9} letterSpacing={2}>
        {label}
      </text>
      {/* LEDs */}
      {leds.map((led, i) => (
        <Led key={i} cx={284 + i * 0} cy={0} color={led.color} delay={led.delay + delay} />
      ))}
      {leds.map((led, i) => (
        <circle key={`led-bg-${i}`} cx={278 + i * 10} cy={y + 32} r={4} fill="#060D1A" stroke="#1A2E4A" strokeWidth={0.5} />
      ))}
      {leds.map((led, i) => (
        <motion.circle
          key={`led-${i}`}
          cx={278 + i * 10}
          cy={y + 32}
          r={2.5}
          fill={led.color}
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: led.delay + delay }}
        />
      ))}
    </motion.g>
  );
}

export function ServerRack() {
  return (
    <motion.svg
      viewBox="0 0 400 460"
      className="w-full max-w-md mx-auto"
      initial="hidden"
      animate="visible"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rack-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0F1E35" />
          <stop offset="100%" stopColor="#060D1A" />
        </linearGradient>
        <filter id="led-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="cloud-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Cloud — top */}
      <motion.g
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        filter="url(#cloud-glow)"
      >
        <path
          d="M 130 30 Q 100 30 100 52 Q 72 52 72 75 Q 72 98 100 98 L 250 98 Q 278 98 278 75 Q 278 52 250 52 Q 250 30 210 30 Q 180 22 130 30 Z"
          fill="none"
          stroke="#00D4FF"
          strokeWidth={1.5}
          opacity={0.7}
        />
        <text x="155" y="72" fill="#00D4FF" fontFamily="JetBrains Mono, monospace" fontSize={10} letterSpacing={2}>
          AZURE
        </text>
        <motion.circle
          cx="190"
          cy="58"
          r="3"
          fill="#00D4FF"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.g>

      {/* Connection beam: cloud → rack 1 */}
      <motion.line
        x1="190" y1="98" x2="190" y2="155"
        stroke="#00D4FF"
        strokeWidth={1.5}
        strokeDasharray="4 4"
        opacity={0.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 2.0, duration: 0.6 }}
      />

      {/* Rack units */}
      <RackUnit y={155} label="HYPER-V / PROXMOX" delay={2.2} />
      <RackUnit y={230} label="AKS / CONTAINERS"  delay={2.5} />
      <RackUnit y={305} label="SERVICES / STORAGE" delay={2.8} />

      {/* Connection lines between racks */}
      {[219, 294].map((y, i) => (
        <motion.line
          key={i}
          x1="190" y1={y} x2="190" y2={y + 11}
          stroke="#7B4FFF"
          strokeWidth={1}
          strokeDasharray="3 3"
          opacity={0.4}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 2.8 + i * 0.2 }}
        />
      ))}

      {/* Floating tech labels */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 3.2, duration: 0.8 }}
      >
        <text x="20" y="430" fill="#6B7A99" fontFamily="JetBrains Mono, monospace" fontSize={8}>
          STATUS: OPERATIONAL
        </text>
        <text x="20" y="445" fill="#6B7A99" fontFamily="JetBrains Mono, monospace" fontSize={8}>
          UPTIME: 99.97%
        </text>
        <motion.circle
          cx="10"
          cy="426"
          r="3"
          fill="#00FF88"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.g>

      {/* Floating label badges */}
      {[
        { x: 310, y: 180, label: "Terraform", color: "#7B4FFF" },
        { x: 316, y: 255, label: "pfSense",   color: "#FFB347" },
        { x: 310, y: 330, label: "Ollama",    color: "#FF6B9D" },
      ].map((badge) => (
        <motion.g
          key={badge.label}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 3.0, duration: 0.6 }}
        >
          <text
            x={badge.x}
            y={badge.y}
            fill={badge.color}
            fontFamily="JetBrains Mono, monospace"
            fontSize={8}
            opacity={0.8}
          >
            {badge.label}
          </text>
        </motion.g>
      ))}
    </motion.svg>
  );
}
