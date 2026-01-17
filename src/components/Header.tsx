import React from 'react';
interface HeaderProps {
 onNavigate: (page: string) => void;
}
const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
 return (<header className="bg-white/95 backdrop-blur-md shadow-md sticky top-0 z-50">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
 <div className="flex items-center justify-between">
 <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent flex items-center gap-2">
 <span className="text-3xl">✍️</span>
 签名验证系统
 </h1>
 <nav className="flex gap-2">
 <button onClick={() => onNavigate('home')} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-700 hover:text-white hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg">
 首页
 </button>
 <button onClick={() => onNavigate('management')} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-700 hover:text-white hover:shadow-lg transition-all duration-300">
 签名管理
 </button>
 <button onClick={() => onNavigate('settings')} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-700 hover:text-white hover:shadow-lg transition-all duration-300">
 系统设置
 </button>
 </nav>
 </div>
 </div>
 </header>);
};
export default Header;
