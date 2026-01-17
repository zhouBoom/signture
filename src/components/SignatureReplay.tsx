import React, { useCallback, useRef } from 'react';
import { SignatureData } from '../types';
interface DrawPoint {
 x: number;
 y: number;
}
import useSignatureReplay from '../hooks/useSignatureReplay';

interface SignatureReplayProps {
 signatureData: SignatureData | null;
}

const SignatureReplay: React.FC<SignatureReplayProps> = ({ signatureData }) => {
 const canvasRef = useRef<HTMLCanvasElement>(null);
 const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
 const lastPointRef = useRef<{
 x: number;
 y: number;
 } | null>(null);
 const [_canvasWidth, setCanvasWidth] = React.useState(800);
 const containerRef = useRef<HTMLDivElement>(null);

 React.useEffect(() => {
 const canvas = canvasRef.current;
 if (!canvas) return;

 const ctx = canvas.getContext('2d');
 if (!ctx) return;

 const dpr = window.devicePixelRatio || 1;
 const rect = canvas.getBoundingClientRect();
 const width = rect.width;
 const height = 300;

 canvas.width = width * dpr;
 canvas.height = height * dpr;
 ctx.scale(dpr, dpr);

 ctx.lineWidth = 3;
 ctx.lineCap = 'round';
 ctx.lineJoin = 'round';
 ctx.strokeStyle = '#1a202c';

 ctxRef.current = ctx;
 ctx.clearRect(0, 0, width, height);
 lastPointRef.current = null;
 }, [signatureData]);

 React.useEffect(() => {
 const container = containerRef.current;
 if (container) {
 const resizeObserver = new ResizeObserver(() => {
 setCanvasWidth(container.offsetWidth);
 });
 resizeObserver.observe(container);
 return () => resizeObserver.disconnect();
 }
 }, []);
 const { isPlaying, isPaused, isCompleted, progress, speed, start, pause, resume, reset, setSpeed, } = useSignatureReplay(signatureData, {
 onDraw: useCallback((point: DrawPoint) => {
 const ctx = ctxRef.current;
 if (!ctx)
 return;
 
 if (!lastPointRef.current) {
 ctx.beginPath();
 ctx.moveTo(point.x, point.y);
 }
 
 ctx.lineTo(point.x, point.y);
 ctx.stroke();
 lastPointRef.current = point;
 }, []),
 onClear: useCallback(() => {
 const canvas = canvasRef.current;
 const ctx = ctxRef.current;
 if (!ctx || !canvas) return;
 
 const rect = canvas.getBoundingClientRect();
 ctx.clearRect(0, 0, rect.width, 300);
 lastPointRef.current = null;
 }, []),
 onComplete: useCallback(() => {
 console.log('Replay completed');
 }, []),
 });
 
 const handleStart = useCallback(() => {
 if (isPaused) {
 resume();
 }
 else {
 start();
 }
 }, [isPaused, start, resume]);
 const handlePause = useCallback(() => {
 pause();
 }, [pause]);
 const handleReset = useCallback(() => {
 reset();
 }, [reset]);
 const handleSpeedChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
 setSpeed(Number(e.target.value));
 }, [setSpeed]);
 if (!signatureData || signatureData.strokes.length === 0) {
 return (<div className="text-center py-8 text-slate-400">
 <p className="text-lg">请先绘制签名以查看回放</p>
 </div>);
 }
 return (<div className="space-y-6">
 <div ref={containerRef} className="w-full rounded-xl overflow-hidden shadow-inner">
 <canvas ref={canvasRef} className="w-full h-[300px] bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-xl"/>
 </div>
 <div className="space-y-5">
 <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4">
 <span className="font-semibold text-slate-700 flex items-center gap-2">
 <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 播放进度
 </span>
 <span className="text-slate-600 font-mono bg-white px-3 py-1 rounded-lg shadow-sm">
 {progress.toFixed(1)}%
 </span>
 </div>
 
 <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
 <div 
 className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 transition-all duration-150 ease-out relative"
 style={{ width: `${progress}%` }}
 >
 <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
 </div>
 </div>
 
 <div className="grid grid-cols-3 gap-3">
 <button 
 onClick={handleStart} 
 disabled={isPlaying}
 className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
 >
 <span className="relative z-10 flex items-center justify-center gap-2">
 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
 {isPaused ? (
 <path d="M10 18l-6-6 6-6v12zM18 18V6h2v12h-2z" />
 ) : (
 <path d="M8 5v14l11-7z" />
 )}
 </svg>
 {isPaused ? '继续' : '开始'}
 </span>
 <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
 </button>
 
 <button 
 onClick={handlePause} 
 disabled={!isPlaying}
 className="group relative px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
 >
 <span className="relative z-10 flex items-center justify-center gap-2">
 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
 <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
 </svg>
 暂停
 </span>
 <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
 </button>
 
 <button 
 onClick={handleReset} 
 className="group relative px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
 >
 <span className="relative z-10 flex items-center justify-center gap-2">
 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
 <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
 </svg>
 重置
 </span>
 <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
 </button>
 </div>
 
 <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-4">
 <span className="font-semibold text-slate-700 flex items-center gap-2">
 <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
 </svg>
 倍速
 </span>
 <select 
 value={speed} 
 onChange={handleSpeedChange}
 className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-800 bg-white cursor-pointer hover:border-blue-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium shadow-sm appearance-none bg-no-repeat pr-10"
 style={{
 backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
 backgroundPosition: 'right 12px center',
 backgroundSize: '20px',
 }}
 >
 <option value={0.25}>0.25x 超慢</option>
 <option value={0.5}>0.5x 慢速</option>
 <option value={1}>1x 正常</option>
 <option value={1.5}>1.5x 快速</option>
 <option value={2}>2x 倍速</option>
 <option value={3}>3x 极速</option>
 </select>
 </div>
 
 {isCompleted && (
 <div className="text-center py-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
 <span className="text-green-600 font-semibold flex items-center justify-center gap-2">
 <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
 <path fillRule="evenodd" d="M16.5 3.75a1.5 1.5 0 011.5 1.5v13.5a1.5 1.5 0 01-1.5 1.5h-9a1.5 1.5 0 01-1.5-1.5V5.25a1.5 1.5 0 011.5-1.5h9zm4.5 1.5a3 3 0 00-3-3h-9a3 3 0 00-3 3v13.5a3 3 0 003 3h9a3 3 0 003-3V5.25zm-4.72 7.72a.75.75 0 00-1.06 0L9 15.94l-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.5-4.5a.75.75 0 000-1.06z" clipRule="evenodd" />
 </svg>
 回放已完成
 </span>
 </div>
 )}
 </div>
 </div>);
};
export default SignatureReplay;
