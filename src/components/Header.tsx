import React from 'react';
interface HeaderProps {
 onNavigate: (page: string) => void;
}
const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
 return (<header className="header">
 <div className="header-content">
 <h1 className="logo">
 <span className="logo-icon">✍️</span>
 签名验证系统
 </h1>
 <nav className="nav">
 <button onClick={() => onNavigate('home')} className="nav-link active">
 首页
 </button>
 <button onClick={() => onNavigate('management')} className="nav-link">
 签名管理
 </button>
 <button onClick={() => onNavigate('settings')} className="nav-link">
 系统设置
 </button>
 </nav>
 </div>
 </header>);
};
export default Header;
