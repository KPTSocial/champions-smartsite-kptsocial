import { useHeroBadge } from '@/hooks/useHeroBadge';
import { motion } from 'framer-motion';

const HeroBadge = () => {
  const { data: badge } = useHeroBadge();

  if (!badge) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="absolute top-20 left-4 z-30 md:top-24 md:left-6"
    >
      <img
        src={badge.image_url}
        alt="Community Award Badge"
        className="h-24 w-auto lg:h-32 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] object-contain"
      />
    </motion.div>
  );
};

export default HeroBadge;
