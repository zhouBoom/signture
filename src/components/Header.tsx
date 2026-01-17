import React from 'react';

interface HeaderProps {
  showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error', title?: string) => void;
}

const Header: React.FC<HeaderProps> = ({ showToast }) => {
  const handleNavClick = (page: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    if (page !== 'home') {
      e.preventDefault();
      const pageNames: Record<string, string> = {
        'management': '签名管理',
        'history': '历史记录',
        'settings': '系统设置'
      };
      showToast(`"${pageNames[page]}"功能正在开发中，敬请期待！`, 'info', '功能提示');
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md text-slate-900 py-5 shadow-lg shadow-black/8 sticky top-0 z-40">
      <div className="container mx-auto px-5">
        <div className="header-content flex justify-between items-center">
          <h1 className="logo text-2xl font-bold flex items-center gap-2.5">
            <span className="logo-icon text-3xl drop-shadow-[0_2px_4px_rgba(59,130,246,0.3)]">✍️</span>
            <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
              签名验证系统
            </span>
          </h1>
          <nav className="nav flex gap-2.5">
            <a
              href="#"
              className="nav-link active bg-gradient-to-r from-primary-500 to-primary-700 text-white px-4.5 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-primary-500/30"
              data-page="home"
            >
              首页
            </a>
            <a
              href="#"
              className="nav-link text-slate-500 hover:bg-gradient-to-r hover:from-primary-500 hover:to-primary-700 hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-500/30 px-4.5 py-2.5 rounded-xl font-medium transition-all duration-300"
              data-page="management"
              onClick={(e) => handleNavClick('management', e)}
            >
              签名管理
            </a>
            <a
              href="#"
              className="nav-link text-slate-500 hover:bg-gradient-to-r hover:from-primary-500 hover:to-primary-700 hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-500/30 px-4.5 py-2.5 rounded-xl font-medium transition-all duration-300"
              data-page="settings"
              onClick={(e) => handleNavClick('settings', e)}
            >
              系统设置
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
