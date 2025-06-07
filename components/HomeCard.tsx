import React from "react";

interface HomeCardProps {
  icon: React.ReactNode;
  label: string;
  title: string;
  description: string;
}

const HomeCard = ({ icon, label, title, description }: HomeCardProps) => {
  return (
    <div className="flex flex-col items-start p-6 bg-slate-50 dark:bg-[#212121] rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-slate-200 dark:border-slate-700">
      <div className="mb-4">{icon}</div>

      <span className="mb-1 text-sm font-semibold text-teal-500 dark:text-teal-500">
        {label}
      </span>

      <h3 className="mb-2 text-xl font-bold text-slate-800 dark:text-slate-100">
        {title}
      </h3>

      <p className="text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  );
};

export default HomeCard;
