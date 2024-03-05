import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface TimerProps {
  size: number;
  strokeWidth: number;
  time: number;
}
const Timer: React.FC<TimerProps> = ({ size, strokeWidth, time }) => {
  const [timerActive, setTimerActive] = useState(true);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [currTime, setCurrTime] = useState<number>(time - 1);
  const [displayTime, setDisplayTime] = useState<number>(time);
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    if (timerActive && timeoutId === null) {
      setCurrTime((prevCurrTime) => prevCurrTime - 1);
      const id = setInterval(() => {
        setDisplayTime((prevTime) => prevTime - 1);
        setCurrTime((prevCurrTime) => prevCurrTime - 1);
      }, 1000);
      setTimeoutId(id);
    }

    return () => {
      if (timeoutId !== null && (currTime <= 0 || !timerActive)) {
        setTimerActive(false);
        clearInterval(timeoutId);
      }
    };
  }, [timerActive, currTime, timeoutId]);

  useEffect(() => {
    setProgress(((time - currTime) / time) * 100 - 10);
    console.log("time", time, currTime);
    // console.log(progress, progress);
    console.log((100 - progress / 2) / 100);
  }, [currTime, time]);

  return (
    <motion.svg version="1.1" className={`w-[${size}px] h-[${size}px`}>
      <clipPath id="cut-off">
        <rect x="0" y="0" width={`${size}`} height={`${size / 2}`} />
      </clipPath>

      <circle
        cx={`${size / 2}px`}
        cy={`${size / 2}px`}
        r={`${size / 2 - strokeWidth}`}
        strokeWidth={`${strokeWidth}px`}
        stroke="#ddd"
        fill="transparent"
        className="svg-indicator-track"
        clip-path="url(#cut-off)"
      />
      <motion.circle
        className="svg-indicator-indication"
        initial={{
          pathLength: 1,
          clipPath: "url(#cut-off)",
        }}
        animate={{
          pathLength: currTime === time ? 0.9 : (100 - progress / 2) / 100,
        }}
        transition={{
          ease: "linear",
          duration: 1,
        }}
        cx={`${size / 2}px`}
        cy={`${size / 2}px`}
        r={`${size / 2 - strokeWidth}`}
        strokeWidth={`${strokeWidth}px`}
        stroke="#07c"
        fill="transparent"
      />
      <text
        x={`${size / 2}px`}
        y={`${size * 0.3}px`}
        textAnchor="middle"
        fill="#ffffff"
        fontSize={50}
      >
        {currTime + 1 === time ? time : displayTime - 1}
      </text>
    </motion.svg>
  );
};

export default Timer;
