import MotionWrapper from './MotionWrapper';

export default function StepCard({ step, title, description, icon, index }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.15,
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <MotionWrapper
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="h-full w-full p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-xl dark:bg-gray-800 dark:border-gray-700 transition-shadow duration-200 ease-out cursor-pointer flex flex-col items-center text-center"
    >
      <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900">
        {icon}
      </div>
      <div className="flex items-center justify-center mb-2">
        <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400 ml-2 sm:text-xl">{step}</span>
        <h5 className="text-lg font-semibold leading-snug text-gray-900 dark:text-white sm:text-xl">
          {title}
        </h5>
      </div>
      <p className="text-sm font-normal text-gray-700 dark:text-gray-400 leading-relaxed sm:text-base">
        {description}
      </p>
    </MotionWrapper>
  );
}
