import { useState, useCallback } from 'react';
import { SignatureData, VerificationResult, VerificationMode } from '../types';
interface UseSignatureVerificationReturn {
 result: VerificationResult | null;
 isVerifying: boolean;
 verifySignature: (data: SignatureData, threshold: number, mode: VerificationMode) => Promise<void>;
 resetResult: () => void;
}
const useSignatureVerification = (): UseSignatureVerificationReturn => {
 const [result, setResult] = useState<VerificationResult | null>(null);
 const [isVerifying, setIsVerifying] = useState(false);
 const verifySignature = useCallback(async (data: SignatureData, threshold: number, mode: VerificationMode): Promise<void> => {
 if (data.strokes.length === 0) {
 return;
 }
 setIsVerifying(true);
 await new Promise(resolve => setTimeout(resolve, 1000));
 const matchScore = Math.floor(Math.random() * 25 + 70);
 const success = matchScore >= threshold;
 setResult({
 success,
 matchScore,
 threshold,
 mode,
 message: success ? '签名验证通过！' : '签名验证未通过！'
 });
 setIsVerifying(false);
 }, []);
 const resetResult = useCallback(() => {
 setResult(null);
 }, []);
 return {
 result,
 isVerifying,
 verifySignature,
 resetResult
 };
};
export default useSignatureVerification;
