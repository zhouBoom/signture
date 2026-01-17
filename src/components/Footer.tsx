import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/95 backdrop-blur-md text-slate-500 py-6 text-center mt-15 shadow-lg shadow-black/8">
      <div className="container mx-auto px-5">
        <div className="footer-content">
          <p className="text-slate-500 font-medium">
            © 2025 动态签名验证系统 | 基于模式识别技术
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
