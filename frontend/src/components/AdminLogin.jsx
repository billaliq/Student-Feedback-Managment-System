import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Shield, Loader2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await login(data.username, data.password);
      if (result.success) {
        toast.success("Welcome back");
        navigate("/admin");
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError) =>
    `w-full px-4 py-3 bg-charcoal-light/60 border rounded-lg text-sm text-champagne placeholder-smoke/50 outline-none transition-all duration-300 focus:ring-1 ${
      hasError
        ? "border-crimson-light/50 focus:ring-crimson-light/30 focus:border-crimson-light/60"
        : "border-ash/40 focus:ring-gold/20 focus:border-gold/40"
    }`;

  return (
    <div className="max-w-md mx-auto mt-8 relative z-10">
      {/* Header */}
      <div className="text-center mb-10 animate-fade-in-up">
        <div className="w-16 h-16 rounded-2xl bg-gold/[0.06] border border-gold/15 flex items-center justify-center mx-auto mb-5">
          <Shield className="w-7 h-7 text-gold" />
        </div>
        <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3 font-medium">Restricted Access</p>
        <h1 className="font-serif text-3xl text-champagne mb-2">Admin Portal</h1>
        <div className="editorial-line mt-4" />
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="glass-card rounded-2xl p-8 sm:p-10 space-y-6 animate-fade-in-up stagger-2"
      >
        <div>
          <label className="block text-xs tracking-widest uppercase text-gold/80 mb-2 font-medium">Username</label>
          <input
            type="text"
            placeholder="Enter username"
            className={inputClass(errors.username)}
            {...register("username", { required: "Username is required" })}
          />
          {errors.username && (
            <p className="mt-1.5 text-xs text-crimson-light">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase text-gold/80 mb-2 font-medium">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className={inputClass(errors.password)}
              {...register("password", { required: "Password is required" })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-smoke/40 hover:text-gold transition-colors duration-300 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-crimson-light">{errors.password.message}</p>
          )}
        </div>

        {/* Divider */}
        <div className="editorial-line !w-full !bg-gradient-to-r !from-transparent !via-ash/30 !to-transparent" />

        <button
          type="submit"
          disabled={loading}
          className="btn-gold w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-lg cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Authenticating...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </div>
  );
}
