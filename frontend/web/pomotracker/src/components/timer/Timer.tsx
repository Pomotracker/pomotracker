import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface TimerProps {
  size: number;
  strokeWidth: number;
  time: number;
}
const Timer: React.FC<TimerProps> = ({ size, strokeWidth, time }) => {
  const [timerActive, setTimerActive] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [currTime, setCurrTime] = useState<number>(time);
  const [displayTime, setDisplayTime] = useState<number>(time - 1);
  const [progress, setProgress] = useState(100);

  function handleClick() {
    setTimerActive(!timerActive);
  }
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
      if (timeoutId !== null && (currTime <= 1 || !timerActive)) {
        setTimerActive(false);
        clearInterval(timeoutId);
      }
    };
  }, [timerActive, currTime, timeoutId]);

  useEffect(() => {
    setProgress((currTime / time) * 100);
  }, [currTime, time]);

  return (
    <div>
      <motion.svg version="1.1" className={`w-[${size}px] h-[${size / 2}px]`}>
        <circle
          cx={`${size / 2}px`}
          cy={`${size / 2}px`}
          r={`${size / 2 - strokeWidth}`}
          strokeWidth={`${strokeWidth}px`}
          stroke="#ddd"
          fill="transparent"
          className="svg-indicator-track"
        />
        <motion.circle
          className="svg-indicator-indication"
          initial={{
            pathLength: 1,
          }}
          animate={{
            pathLength: 1 - (100 - progress) / (2 * 100),
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
          {currTime === time && !timerActive ? time : displayTime}
        </text>
      </motion.svg>
      <button onClick={() => handleClick()}>start</button>
    </div>
  );
};

export default Timer;
