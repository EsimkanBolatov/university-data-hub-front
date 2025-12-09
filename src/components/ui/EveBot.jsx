import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const EveBot = ({ state = 'idle' }) => {
  // state: 'idle', 'listening', 'processing', 'speaking'
  const [blink, setBlink] = useState(false);
  const [headRotation, setHeadRotation] = useState(0);
  const [verticalOffset, setVerticalOffset] = useState(0);

  // Логика "Живого существа"
  useEffect(() => {
    // 1. Случайное моргание (каждые 3-6 секунд)
    const blinkLoop = () => {
      if (Math.random() > 0.3) { // 70% шанс моргнуть
        setBlink(true);
        setTimeout(() => setBlink(false), 200);
      }
      const nextBlink = Math.random() * 3000 + 3000;
      setTimeout(blinkLoop, nextBlink);
    };

    // 2. Мягкие повороты головы в состоянии idle
    const idleMovement = setInterval(() => {
      if (state === 'idle') {
        // Небольшой случайный поворот (-8 до 8 градусов)
        const rotation = Math.random() * 16 - 8;
        // Небольшое смещение по вертикали для "дыхания"
        const offset = Math.random() * 10 - 5;

        setHeadRotation(rotation);
        setVerticalOffset(offset);
      } else {
        setHeadRotation(0);
        setVerticalOffset(0);
      }
    }, 4000); // Реже обновляем, чтобы движения были плавнее

    const blinkTimeout = setTimeout(blinkLoop, 1000);

    return () => {
      clearTimeout(blinkTimeout);
      clearInterval(idleMovement);
    };
  }, [state]);

  // Цвета глаз
  const getEyeColor = () => {
    switch (state) {
      case 'listening': return '#4ade80'; // Зеленый
      case 'processing': return '#fbbf24'; // Желтый
      case 'speaking': return '#60a5fa';   // Синий
      default: return '#38bdf8'; // Голубой
    }
  };

  const eyeColor = getEyeColor();

  // Варианты для глаз
  const eyeVariants = {
    normal: {
      scaleY: blink ? 0.1 : 1,
      height: blink ? 2 : 16,
      transition: { type: "spring", stiffness: 500, damping: 30 }
    },
    listening: {
      scaleY: 1.1,
      height: 20,
      width: 12,
      transition: { type: "spring", stiffness: 300 }
    },
    processing: {
      scaleY: [1, 0.2, 1],
      transition: { repeat: Infinity, duration: 0.5 }
    },
    speaking: {
      height: [14, 22, 14],
      transition: { repeat: Infinity, duration: 0.3 }
    }
  };

  const currentEyeVariant = state === 'idle' ? 'normal' : state;

  return (
    <div className="relative w-64 h-80 flex flex-col items-center justify-center pointer-events-none">

      {/* 1. Аура (Свечение) - Отдельный слой, чтобы не грузить GPU */}
      <motion.div
        animate={{
          scale: state === 'speaking' ? [1, 1.1, 1] : [1, 1.05, 1],
          opacity: state === 'speaking' ? [0.2, 0.4, 0.2] : [0.1, 0.2, 0.1]
        }}
        transition={{
          repeat: Infinity,
          duration: state === 'speaking' ? 1.5 : 4,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-blue-500 rounded-full blur-3xl -z-10"
        style={{ willChange: 'transform, opacity' }} // Оптимизация GPU
      />

      {/* Контейнер для левитации всего бота */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut"
        }}
        className="relative flex flex-col items-center"
      >

        {/* 2. ГОЛОВА */}
        <motion.div
          animate={{
            rotate: headRotation,
            y: verticalOffset * 0.2 // Небольшой параллакс эффект
          }}
          transition={{
            type: "spring",
            stiffness: 40, // Мягкая пружина
            damping: 15,
            mass: 1.2
          }}
          className="relative w-44 h-32 bg-white rounded-[50px] shadow-2xl flex items-center justify-center border-2 border-slate-50 overflow-hidden z-20"
          style={{ willChange: 'transform' }}
        >
          {/* Лицевая панель (Экран) */}
          <div className="w-36 h-24 bg-slate-900 rounded-[45px] flex items-center justify-center gap-6 relative shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] overflow-hidden">

            {/* Текстура экрана */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-700 to-black"></div>

            {/* Левый глаз */}
            <motion.div
              variants={eyeVariants}
              animate={currentEyeVariant}
              className="w-9 bg-white shadow-[0_0_15px_rgba(255,255,255,0.6)] relative z-10"
              style={{
                  backgroundColor: eyeColor,
                  borderRadius: '50% 50% 40% 40% / 60% 60% 40% 40%',
                  boxShadow: `0 0 20px ${eyeColor}`
              }}
            />

            {/* Правый глаз */}
            <motion.div
              variants={eyeVariants}
              animate={currentEyeVariant}
              className="w-9 bg-white shadow-[0_0_15px_rgba(255,255,255,0.6)] relative z-10"
              style={{
                  backgroundColor: eyeColor,
                  borderRadius: '50% 50% 40% 40% / 60% 60% 40% 40%',
                  boxShadow: `0 0 20px ${eyeColor}`
              }}
            />

            {/* Блики на стекле (Статичные для реализма) */}
            <div className="absolute top-3 right-8 w-6 h-3 bg-white/10 rounded-full rotate-[-15deg] blur-[2px]"></div>
            <div className="absolute bottom-3 left-8 w-4 h-2 bg-white/5 rounded-full rotate-[-15deg] blur-[1px]"></div>
          </div>
        </motion.div>

        {/* 3. КОРПУС */}
        <motion.div
          animate={{
            y: -10, // Подтягиваем к голове
            rotate: headRotation * 0.2 // Корпус поворачивается слабее головы
          }}
          transition={{
            type: "spring",
            stiffness: 30,
            damping: 20,
            delay: 0.1 // Корпус чуть отстает от головы (инерция)
          }}
          className="w-28 h-36 bg-white rounded-b-[50px] rounded-t-[30px] -mt-6 shadow-xl flex items-center justify-center border-t border-slate-100 z-10 relative"
        >
          {/* Индикатор на груди */}
          <div className="absolute top-10">
              <motion.div
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: state === 'processing' ? [1, 1.2, 1] : 1
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-16 h-16 rounded-full blur-xl"
                  style={{ backgroundColor: eyeColor, opacity: 0.2 }}
              />
              <div
                className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]"
                style={{ backgroundColor: state === 'processing' ? '#fbbf24' : '#94a3b8' }}
              />
          </div>

          {/* Левая рука */}
          <motion.div
              animate={{
                  rotate: state === 'speaking' ? [0, 15, 0] : [0, 5, 0],
                  y: state === 'speaking' ? [0, -5, 0] : [0, 2, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: state === 'speaking' ? 0.5 : 4,
                ease: "easeInOut"
              }}
              className="absolute -left-6 top-6 w-8 h-28 bg-white rounded-full origin-top transform -rotate-12 shadow-md border-r border-slate-100"
          />

          {/* Правая рука */}
          <motion.div
              animate={{
                  rotate: state === 'speaking' ? [0, -15, 0] : [0, -5, 0],
                  y: state === 'speaking' ? [0, -5, 0] : [0, 2, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: state === 'speaking' ? 0.5 : 4,
                ease: "easeInOut",
                delay: 0.2
              }}
              className="absolute -right-6 top-6 w-8 h-28 bg-white rounded-full origin-top transform rotate-12 shadow-md border-l border-slate-100"
          />
        </motion.div>

      </motion.div>

      {/* 4. Тень на земле */}
      <motion.div
        animate={{
          scaleX: [1, 0.8, 1],
          opacity: [0.2, 0.1, 0.2]
        }}
        transition={{
          repeat: Infinity,
          duration: 6, // Синхронизировано с левитацией
          ease: "easeInOut"
        }}
        className="w-24 h-4 bg-black rounded-[100%] blur-md mt-12 opacity-20"
      />
    </div>
  );
};

export default EveBot;