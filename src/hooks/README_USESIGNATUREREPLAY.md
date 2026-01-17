# useSignatureReplay Hook 使用指南

## 概述

`useSignatureReplay` 是一个用于实现签名回放功能的 React Hook，它提供了真实时间维度的回放、倍速控制和完整的播放控制功能。

## 功能特性

1. **真实时间维度回放** - 基于签名记录中每个点的 timestamp 进行回放
2. **倍速控制** - 支持 0.25x 到 3x 的播放速度调节
3. **完整的播放控制** - 开始、暂停、继续、重置功能
4. **进度追踪** - 实时显示回放进度百分比
5. **事件回调** - 提供绘制、清除、完成等事件的回调函数

## API 接口

### Hook 返回值

```typescript
interface UseSignatureReplayReturn {
  isPlaying: boolean;           // 是否正在播放
  isPaused: boolean;            // 是否处于暂停状态
  isCompleted: boolean;         // 回放是否完成
  progress: number;             // 回放进度 (0-100)
  speed: number;                // 当前播放速度
  start: () => void;            // 开始回放
  pause: () => void;            // 暂停回放
  resume: () => void;           // 继续回放
  reset: () => void;            // 重置回放
  setSpeed: (speed: number) => void; // 设置播放速度
}
```

### 参数选项

```typescript
interface ReplayOptions {
  onDraw?: (point: { x: number; y: number }) => void;  // 绘制每个点时的回调
  onClear?: () => void;                                // 清空画布时的回调
  onComplete?: () => void;                             // 回放完成时的回调
}
```

## 使用示例

### 基础使用

```typescript
import { useRef, useCallback } from 'react';
import useSignatureReplay from './hooks/useSignatureReplay';
import { SignatureData } from '../types';

function MyReplayComponent({ signatureData }: { signatureData: SignatureData | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const { isPlaying, isPaused, isCompleted, progress, speed, start, pause, resume, reset, setSpeed } = useSignatureReplay(
    signatureData,
    {
      onDraw: useCallback((point) => {
        const ctx = ctxRef.current;
        if (!ctx) return;

        // 使用 Canvas API 绘制点
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }, []),

      onClear: useCallback(() => {
        const ctx = ctxRef.current;
        const canvas = canvasRef.current;
        if (!ctx || !canvas) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }, []),

      onComplete: useCallback(() => {
        console.log('回放完成！');
      }, []),
    }
  );

  return (
    <div>
      <canvas ref={canvasRef} />
      
      <div>进度: {progress.toFixed(1)}%</div>
      
      <button onClick={() => isPaused ? resume() : start()}>
        {isPaused ? '继续' : '开始'}
      </button>
      <button onClick={pause} disabled={!isPlaying}>
        暂停
      </button>
      <button onClick={reset}>
        重置
      </button>
      
      <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
        <option value={0.25}>0.25x</option>
        <option value={0.5}>0.5x</option>
        <option value={1}>1x</option>
        <option value={1.5}>1.5x</option>
        <option value={2}>2x</option>
        <option value={3}>3x</option>
      </select>
    </div>
  );
}
```

### 在 App.tsx 中集成

```typescript
// 在 App.tsx 中引入
import SignatureReplay from './components/SignatureReplay';

function App() {
  const [signatureData, setSignatureData] = useState<SignatureData | null>(null);
  
  return (
    <div>
      <SignatureCanvas 
        onSignatureChange={handleSignatureChange} 
        onClear={handleClear}
      />
      
      <SignatureReplay signatureData={signatureData} />
    </div>
  );
}
```

## 实现原理

### 时间计算

Hook 会计算每个点相对于签名开始时间的时间偏移量：

```typescript
const firstPointTime = data.strokes[0].points[0]?.timestamp || data.startTime;
const offset = point.timestamp - firstPointTime;
```

### 动画播放

使用 `requestAnimationFrame` 实现平滑的逐点绘制动画：

```typescript
const replayLoop = (timestamp) => {
  const elapsed = (timestamp - startTime) * speed;
  // 根据 elapsed 确定当前应该绘制到哪个点
  // 调用 onDraw 回调绘制点
  animationFrameRef.current = requestAnimationFrame(replayLoop);
};
```

## 最佳实践

1. **Canvas 初始化** - 在使用 Hook 前确保 Canvas 已正确初始化并获取 context
2. **性能优化** - 建议在 onDraw 回调中使用 Canvas API 而非 React 状态更新
3. **内存管理** - 在组件卸载时确保清除所有动画帧引用
4. **设备像素比** - 考虑使用 devicePixelRatio 以支持高清显示

## 注意事项

- 如果 signatureData 为 null 或没有任何笔画，回放功能将不可用
- 速度值应大于 0，建议范围是 0.25 到 3
- 回放过程中修改速度会立即生效
- 重置操作会清空画布并重置进度