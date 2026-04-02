import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const { forgotPassword, isForgottingPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await forgotPassword({ email });
      // Always show success message as per best practices
      toast({ 
        title: "Check your email", 
        description: "If an account with that email exists, we sent a password reset code." 
      });
      // Redirect to reset password with email in state
      navigate("/reset-password", { state: { email } });
    } catch (error) {
      // Still show success to prevent enumeration
      toast({ 
        title: "Check your email", 
        description: "If an account with that email exists, we sent a password reset code." 
      });
      navigate("/reset-password", { state: { email } });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your email address to receive a password reset code.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="you@example.com"
              className="mt-1"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isForgottingPassword || !email}>
            {isForgottingPassword ? "Sending..." : "Send Reset Code"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
