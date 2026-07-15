import { motion } from "framer-motion";

const DashboardCard = ({
  title,
  value,
  color,
  icon,
}) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
      }}
      className={`rounded-2xl shadow-lg p-6 text-white ${color}`}
    >
      <div className="flex justify-between items-center">

        <div>

          <p className="text-lg opacity-90">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {value}
          </h2>

        </div>

        <div className="text-5xl opacity-80">
          {icon}
        </div>

      </div>
    </motion.div>
  );
};

export default DashboardCard;