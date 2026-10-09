import { motion } from "framer-motion";


const blobs = [
  {
    className:
      "absolute -left-32 -top-32 h-96 w-96 rounded-full bg-sky-300/40 blur-3xl",
    animate: {
      x: [0, 80, 20, 0],
      y: [0, 50, 100, 0],
      scale: [1, 1.15, 0.95, 1],
    },
    duration: 18,
  },
  {
    className:
      "absolute -right-32 top-20 h-[28rem] w-[28rem] rounded-full bg-cyan-200/40 blur-3xl",
    animate: {
      x: [0, -70, -20, 0],
      y: [0, 80, 30, 0],
      scale: [1, 0.9, 1.15, 1],
    },
    duration: 22,
  },
  {
    className:
      "absolute bottom-[-10rem] left-1/3 h-[30rem] w-[30rem] rounded-full bg-blue-200/30 blur-3xl",
    animate: {
      x: [0, 100, -60, 0],
      y: [0, -50, -100, 0],
      scale: [1, 1.1, 0.9, 1],
    },
    duration: 25,
  },
];

function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed overflow-hidden inset-0 -z-10 bg-sky-50">
      <div className="absolute inset-0 bg-linear-to-br from-sky-100 via-white to-cyan-50"/>
        {blobs.map((blob,index)=>(
            <motion.div key={index}
            className={blob.className}
            animate={blob.animate}
            transition={{
                duration:blob.duration,
                repeat:Infinity,
                ease:"easeInOut"
            }}/>
        ))}
      
      <div className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40 blur-[120px]" />
    </div>
  );
}

export default AnimatedBackground;
