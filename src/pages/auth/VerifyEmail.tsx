import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth-store";

export default function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const { verifyEmail, resendOtp, isVerifyingEmail, isResendingOtp } = useAuth();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const email = user?.email || location.state?.email;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Error", description: "Email not found. Please log in again.", variant: "destructive" });
      navigate("/login");
      return;
    }

    try {
      await verifyEmail({ email, otp });
      
      if (user) {
        // update stored user data locally and navigate
        useAuthStore.getState().setUser({ ...user, emailVerified: true });
        toast({ title: "Success", description: "Email verified successfully!" });
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      } else {
        toast({ title: "Success", description: "Email verified successfully! Please log in." });
        navigate("/login", { replace: true });
      }

    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.response?.data?.message || "Invalid OTP code",
        variant: "destructive",
      });
    }
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      await resendOtp({ email });
      toast({ title: "Sent", description: "A new OTP has been sent to your email." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to resend OTP", variant: "destructive" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Verify Your Email</h2>
        <p className="text-center text-gray-600 mb-6">
          We've sent a 6-digit verification code to <span className="font-medium text-black">{email}</span>
        </p>
        <form onSubmit={handleVerify} className="space-y-6 flex flex-col items-center">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <Button type="submit" className="w-full" disabled={otp.length !== 6 || isVerifyingEmail}>
            {isVerifyingEmail ? "Verifying..." : "Verify Email"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Button variant="link" onClick={handleResend} disabled={isResendingOtp}>
            {isResendingOtp ? "Resending..." : "Didn't receive a code? Resend"}
          </Button>
        </div>
      </div>
    </div>
  );
}
