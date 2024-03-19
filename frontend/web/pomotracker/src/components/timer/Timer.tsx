import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface TimerProps {
  size: number;
  strokeWidth: number;
  time: number;
}

const variants = {
  show: {
    opacity: 1,
    transition: {
      ease: "easeOut",
      duration: 0.5,
    },
  },
  hide: {
    opacity: 0,
    transition: {
      ease: "easeOut",
      duration: 0.5,
    },
  },
};

const Timer: React.FC<TimerProps> = ({ size, strokeWidth, time }) => {
  const [timerActive, setTimerActive] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [currTime, setCurrTime] = useState<number>(time);
  const [displayTime, setDisplayTime] = useState<number>(time);
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
      if (timeoutId !== null && (currTime <= 0 || !timerActive)) {
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
      <motion.svg version="1.1" width={size} height={size / 4}>
        <circle
          cx={`${size / 2}`}
          cy={`${size / 4}`}
          r={`${size / 4 - strokeWidth}`}
          strokeWidth={`${strokeWidth}`}
          stroke="#ddd"
          fill="transparent"
          className="svg-indicator-track"
        />
        <motion.circle
          className="svg-indicator-indication"
          initial={{
            pathLength: 1.1,
          }}
          animate={{
            pathLength: 1 - (100 - progress) / (2 * 100),
          }}
          transition={{
            ease: "linear",
            duration: 1,
          }}
          cx={`${size / 2}`}
          cy={`${size / 4}`}
          r={`${size / 4 - strokeWidth}`}
          strokeWidth={`${strokeWidth}`}
          stroke="#07c"
          fill="transparent"
        />
        <motion.text
          x={`${size / 2}`}
          y={`${size * 0.15}`}
          key={displayTime}
          textAnchor="middle"
          fontSize={50}
          initial={"hide"}
          animate={"show"}
          transition={{ ease: "easeInOut", duration: 1 }}
          variants={variants}
        >
          {currTime === time && !timerActive ? time : displayTime}
        </motion.text>
      </motion.svg>
      <button onClick={() => handleClick()}>start</button>
    </div>
  );
};

export default Timer;
