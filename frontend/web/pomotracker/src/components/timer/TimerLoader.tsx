import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

import ConfettiGenerator from "confetti-js";

interface TimerLoaderProps {
  size: number;
  strokeWidth: number;
  time: number;
  mode: string;
}
const words = ["Achieve", "Focus", "Elevate", "Motivate"];

const variants = {
  show: {
    opacity: 1,
    x: 0,
    transition: {
      ease: "easeOut",
      duration: 1,
    },
  },
  hide: {
    opacity: 0,
    x: -12.5,
    transition: {
      ease: "easeOut",
      duration: 1,
    },
  },
};

const TimerLoader: React.FC<TimerLoaderProps> = ({
  size,
  strokeWidth,
  time,
  mode,
}) => {
  const [timerActive] = useState(true);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [currTime, setCurrTime] = useState<number>(time);
  const [displayTime, setDisplayTime] = useState<number>(time);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (timerActive && timeoutId === null) {
      //   setCurrTime((prevCurrTime) => prevCurrTime - 1);
      const id = setInterval(() => {
        setDisplayTime((prevTime) => prevTime - 1);
        setCurrTime((prevCurrTime) => prevCurrTime - 1);
      }, 2000);

      setTimeoutId(id);
    }

    return () => {
      if (timeoutId !== null && (currTime <= 1 || !timerActive)) {
        // setCurrTime(time);
        // setDisplayTime(time);

        clearInterval(timeoutId);
      }
    };
  }, [timerActive, currTime, timeoutId]);

  useEffect(() => {
    setProgress((currTime / time) * 100);
  }, [currTime, time]);

  useEffect(() => {
    if (currTime <= 0) {
      const confettiSettings = { target: "my-canvas", height: 200 };
      const confetti = new ConfettiGenerator(confettiSettings);
      confetti.render();

      return () => confetti.clear();
    }
  }, [currTime]);
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
          stroke="#76ABAE"
          fill="transparent"
        />
        <motion.text
          x={`${size / 2}`}
          y={`${size * 0.19}`}
          key={displayTime}
          textAnchor="middle"
          fontSize={50}
          initial={"hide"}
          animate={"show"}
          transition={{ ease: "easeInOut", duration: 2 }}
          variants={variants}
          fill={mode === "white" ? "#FFFFFF" : "#000000"}
        >
          {/* {currTime === time && !timerActive ? time : displayTime} */}
          {words[displayTime]}
        </motion.text>
      </motion.svg>
      <div>
        <canvas id="my-canvas" className="absolute left-0 top-0"></canvas>
      </div>
    </div>
  );
};

export default TimerLoader;
