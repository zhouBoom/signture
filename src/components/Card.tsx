import React from 'react';
interface CardProps {
 title: string;
 icon: string;
 children: React.ReactNode;
}
const Card: React.FC<CardProps> = ({ title, icon, children }) => {
 return (<div className="bg-white/98 backdrop-blur-md rounded-2xl shadow-lg p-7 border border-white/50 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300">
 <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
 <span className="text-2xl">{icon}</span>
 {title}
 </h3>
 {children}
 </div>);
};
export default Card;
