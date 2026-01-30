import { SignatureData, VerificationResult, VerificationMode, SignatureFeatures } from '@/types';

// 模拟签名验证算法
export const verifySignature = (
  signatureData: SignatureData,
  threshold: number,
  mode: VerificationMode
): VerificationResult => {
  // 模拟验证过程，实际应用中这里会是复杂的模式识别算法
  const matchScore = Math.floor(Math.random() * 25 + 70); // 70-95 之间的随机分数
  const isValid = matchScore >= threshold;
  
  // 计算特征
  const features = calculateSignatureFeatures(signatureData);
  
  return {
    isValid,
    matchScore,
    threshold,
    mode,
    features,
  };
};

// 计算签名特征
export const calculateSignatureFeatures = (signatureData: SignatureData): SignatureFeatures => {
  const { totalDuration, totalDistance, strokeCount } = signatureData;
  
  // 计算平均速度 (px/s)
  const averageSpeed = totalDuration > 0 ? (totalDistance / (totalDuration / 1000)).toFixed(1) : '0';
  
  // 模拟压力值 (实际应用中需要支持压力感应的设备)
  const pressure = (Math.random() * 30 + 70).toFixed(1); // 70-100 之间的随机值
  
  // 签名时长 (秒)
  const duration = (totalDuration / 1000).toFixed(2);
  
  return {
    strokeSpeed: `${averageSpeed} px/s`,
    strokePressure: `${pressure}%`,
    strokeOrder: strokeCount,
    signDuration: `${duration}s`,
  };
};

// 获取验证模式的文本描述
export const getVerificationModeText = (mode: VerificationMode): string => {
  const modeTexts = {
    dynamic: '动态模式',
    static: '静态模式',
    hybrid: '混合模式',
  };
  
  return modeTexts[mode] || mode;
};

// 生成验证记录ID
export const generateRecordId = (): string => {
  return Date.now().toString();
};

// 格式化时间戳
export const formatTimestamp = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};