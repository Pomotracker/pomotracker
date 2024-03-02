import { motion, useAnimate } from "framer-motion";
import React, { useEffect, useState } from "react";

interface CircleProps {
  radius: number;
  dotRadius: number;
  numDots: number;
}

const Circle: React.FC<CircleProps> = ({ radius }) => {
  const [scope, animate] = useAnimate();
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [angle, setAngle] = useState(90);

  async function myAnimation(angle: number, x: number, y: number) {
    await animate(
      scope.current,
      { rotate: angle },
      {
        type: "tween",
        ease: "linear",
      }
    );
    await animate(
      scope.current,
      { x, y },
      {
        type: "tween",
        ease: "linear",
      }
    );

    // animate(
    //   scope.current,
    //   {
    //     rotate: 100,
    //   },
    //   {
    //     repeat: Infinity,
    //     repeatType: "mirror",
    //     ease: "easeInOut",
    //     duration: 1,
    //   }
    // );
  }

  useEffect(() => {
    const interval = setInterval(() => {
      // increase the angle of rotation
      setAngle(angle + 0.5);
      // if (angle >= 360) {
      //   setAngle(1);
      // } else {
      //   setAngle(angle + 1);
      // }

      // calculate the new ball.x / ball.y
      setX(radius * Math.cos((angle * Math.PI) / 180)); // Convert angle to radians
      setY(radius * Math.sin((angle * Math.PI) / 180)); // Convert angle to radians
      console.log("coords", x, y);
      console.log(angle);

      myAnimation(angle, x, y);
    }, 10); // Decreased interval for smoother animation

    return () => clearInterval(interval);
  }, [angle]);

  // useEffect(() => {
  //   myAnimation(angle, x, y);
  // }, []);

  return (
    <motion.div
      className="fixed w-[50px] h-[10px] border-white border-solid bg-red-800"
      ref={scope}
    />
  );
};

export default Circle;
