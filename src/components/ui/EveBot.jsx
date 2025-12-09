import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const EveBot = ({ state = 'idle' }) => {
  // state: 'idle', 'listening', 'processing', 'speaking'
  const [blink, setBlink] = useState(false);
  const [headRotation, setHeadRotation] = useState(0);

  // Логика "Живого существа"
  useEffect(() => {
    // 1. Случайное моргание (каждые 2-6 секунд)
    const blinkLoop = () => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150); // Закрыть глаза на 150мс
      const nextBlink = Math.random() * 4000 + 2000;
      setTimeout(blinkLoop, nextBlink);
    };

    // 2. Случайные повороты головы в состоянии idle
    const idleMovement = setInterval(() => {
      if (state === 'idle') {
        const rotation = Math.random() * 10 - 5; // от -5 до 5 градусов
        setHeadRotation(rotation);
      } else {
        setHeadRotation(0);
      }
    }, 3000);

    const blinkTimeout = setTimeout(blinkLoop, 1000);

    return () => {
      clearTimeout(blinkTimeout);
      clearInterval(idleMovement);
    };
  }, [state]);

  // Варианты анимации глаз
  const eyeVariants = {
    idle: { scaleY: blink ? 0.1 : 1, height: blink ? 2 : 16, borderRadius: '50%' },
    listening: { scaleY: 1.2, height: 22, width: 10, borderRadius: '40%' },
    processing: { scaleY: [1, 0.2, 1], transition: { repeat: Infinity, duration: 0.4 } },
    speaking: {
      height: [14, 20, 14],
      scaleY: 1,
      transition: { repeat: Infinity, duration: 0.2 }
    }
  };

  // Цвет глаз
  const eyeColor = state === 'listening' ? '#4ade80' : // Зеленый
                   state === 'processing' ? '#fbbf24' : // Желтый
                   state === 'speaking' ? '#60a5fa' :   // Ярко-синий
                   '#38bdf8'; // Голубой (обычный)

  return (
    <div className="relative w-64 h-80 flex flex-col items-center justify-center">

      {/* 1. Аура/Свечение (Пульсирует при разговоре) */}
      <motion.div
        animate={{
          scale: state === 'speaking' ? [1, 1.2, 1] : [1, 1.05, 1],
          opacity: state === 'speaking' ? [0.2, 0.5, 0.2] : 0.1
        }}
        transition={{ repeat: Infinity, duration: state === 'speaking' ? 1 : 4 }}
        className="absolute inset-0 bg-blue-400 rounded-full blur-3xl -z-10"
      />

      {/* 2. ГОЛОВА (Левитация + Повороты) */}
      <motion.div
        animate={{
          y: [0, -15, 0], // Левитация
          rotate: headRotation // Случайный поворот
        }}
        transition={{
          y: { repeat: Infinity, duration: 5, ease: "easeInOut" },
          rotate: { duration: 1 }
        }}
        className="relative w-40 h-32 bg-white rounded-[45%] shadow-xl flex items-center justify-center border border-slate-100 overflow-hidden z-20"
      >
        {/* Черная панель лица */}
        <div className="w-32 h-20 bg-slate-900 rounded-[40%] flex items-center justify-center gap-6 relative shadow-inner overflow-hidden">

          {/* Цифровые полосы (Эффект экрана) */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>

          {/* Левый глаз */}
          <motion.div
            variants={eyeVariants}
            animate={state}
            className="w-8 bg-current shadow-[0_0_15px_rgba(56,189,248,0.8)] relative z-10"
            style={{
                backgroundColor: eyeColor,
                borderRadius: '50% 50% 40% 40% / 60% 60% 40% 40%',
                transform: 'rotate(8deg)'
            }}
          />

          {/* Правый глаз */}
          <motion.div
            variants={eyeVariants}
            animate={state}
            className="w-8 bg-current shadow-[0_0_15px_rgba(56,189,248,0.8)] relative z-10"
            style={{
                backgroundColor: eyeColor,
                borderRadius: '50% 50% 40% 40% / 60% 60% 40% 40%',
                transform: 'rotate(-8deg)'
            }}
          />

          {/* Блик на стекле */}
          <div className="absolute top-2 right-6 w-5 h-3 bg-white/20 rounded-full rotate-[-15deg] blur-[1px]"></div>
        </div>
      </motion.div>

      {/* 3. КОРПУС (Левитация с задержкой) */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.2 }}
        className="w-24 h-32 bg-white rounded-b-[4rem] rounded-t-[2rem] -mt-4 shadow-lg flex items-center justify-center border-t border-slate-100 z-10 relative"
      >
        {/* Индикатор сердца */}
        <div className="absolute top-8">
            <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`w-2 h-2 rounded-full ${state === 'processing' ? 'bg-yellow-400' : 'bg-blue-300'}`}
            />
        </div>

        {/* Руки (Крылья) - Двигаются при разговоре */}
        <motion.div
            animate={{
                rotate: state === 'speaking' ? [0, 10, 0] : 0,
                x: state === 'speaking' ? [0, -5, 0] : 0
            }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute -left-5 top-4 w-5 h-24 bg-white rounded-full origin-top transform -rotate-12 shadow-md border border-slate-50"
        />
        <motion.div
            animate={{
                rotate: state === 'speaking' ? [0, -10, 0] : 0,
                x: state === 'speaking' ? [0, 5, 0] : 0
            }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute -right-5 top-4 w-5 h-24 bg-white rounded-full origin-top transform rotate-12 shadow-md border border-slate-50"
        />
      </motion.div>

      {/* 4. Тень */}
      <motion.div
        animate={{ scale: [1, 0.8, 1], opacity: [0.2, 0.1, 0.2] }}
        transition={{ repeat: Infinity, duration: 5 }}
        className="w-20 h-4 bg-black rounded-full blur-md mt-8 opacity-20"
      />
    </div>
  );
};

export default EveBot;