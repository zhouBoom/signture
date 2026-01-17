import React from 'react';
interface CardProps {
 title: string;
 icon: string;
 children: React.ReactNode;
}
const Card: React.FC<CardProps> = ({ title, icon, children }) => {
 return (<div className="card">
 <h3 className="card-title">
 <span className="card-icon">{icon}</span>
 {title}
 </h3>
 {children}
 </div>);
};
export default Card;
