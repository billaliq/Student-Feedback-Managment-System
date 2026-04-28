import { useForm } from "react-hook-form";
import { useState } from "react";
import { submitFeedback } from "../api";
import { Send, Star, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function FeedbackForm() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      studentName: "",
      subject: "",
      rating: "",
      comments: "",
    },
  });

  const ratingValue = watch("rating");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { ...data, rating: Number(data.rating) };
      await submitFeedback(payload);
      toast.success("Feedback submitted successfully");
      reset();
    } catch (error) {
      const msg =
        error.response?.data?.errors?.join(", ") ||
        error.response?.data?.message ||
        "Failed to submit feedback";
      toast.error(msg);
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
    <div className="max-w-2xl mx-auto relative z-10">
      {/* Header */}
      <div className="text-center mb-10 animate-fade-in-up">
        <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4 font-medium">Share Your Voice</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-champagne mb-3 leading-tight">
          Submit Feedback
        </h1>
        <div className="editorial-line mt-5" />
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="glass-card rounded-2xl p-8 sm:p-10 space-y-7 animate-fade-in-up stagger-2"
      >
        {/* Student Name */}
        <div>
          <label className="block text-xs tracking-widest uppercase text-gold/80 mb-2 font-medium">
            Full Name <span className="text-crimson-light">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            className={inputClass(errors.studentName)}
            {...register("studentName", {
              required: "Student name is required",
              minLength: { value: 2, message: "Name must be at least 2 characters" },
              maxLength: { value: 100, message: "Name must be less than 100 characters" },
            })}
          />
          {errors.studentName && (
            <p className="mt-1.5 text-xs text-crimson-light">{errors.studentName.message}</p>
          )}
        </div>

        {/* Subject */}
        <div>
          <label className="block text-xs tracking-widest uppercase text-gold/80 mb-2 font-medium">
            Subject <span className="text-crimson-light">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Mathematics, Physics, Computer Science"
            className={inputClass(errors.subject)}
            {...register("subject", {
              required: "Subject is required",
              minLength: { value: 2, message: "Subject must be at least 2 characters" },
              maxLength: { value: 100, message: "Subject must be less than 100 characters" },
            })}
          />
          {errors.subject && (
            <p className="mt-1.5 text-xs text-crimson-light">{errors.subject.message}</p>
          )}
        </div>

        {/* Rating */}
        <div>
          <label className="block text-xs tracking-widest uppercase text-gold/80 mb-3 font-medium">
            Rating <span className="text-crimson-light">*</span>
          </label>
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((value) => (
              <label
                key={value}
                className={`flex-1 cursor-pointer rounded-xl border p-3.5 text-center transition-all duration-300 ${
                  Number(ratingValue) === value
                    ? "border-gold/50 bg-gold/[0.08] shadow-[0_0_16px_rgba(201,169,110,0.08)]"
                    : "border-ash/30 hover:border-ash/60 bg-charcoal-light/30"
                }`}
              >
                <input
                  type="radio"
                  value={value}
                  className="sr-only"
                  {...register("rating", { required: "Please select a rating" })}
                />
                <Star
                  className={`w-5 h-5 mx-auto mb-1.5 transition-colors duration-300 ${
                    Number(ratingValue) >= value
                      ? "fill-gold text-gold"
                      : "text-ash"
                  }`}
                />
                <span className={`text-xs font-medium transition-colors duration-300 ${
                  Number(ratingValue) === value ? "text-gold-light" : "text-smoke"
                }`}>{value}</span>
              </label>
            ))}
          </div>
          {errors.rating && (
            <p className="mt-1.5 text-xs text-crimson-light">{errors.rating.message}</p>
          )}
        </div>

        {/* Comments */}
        <div>
          <label className="block text-xs tracking-widest uppercase text-gold/80 mb-2 font-medium">
            Comments <span className="text-smoke/50 normal-case tracking-normal">(optional)</span>
          </label>
          <textarea
            rows={4}
            placeholder="Share your thoughts..."
            className={`${inputClass(errors.comments)} resize-none`}
            {...register("comments", {
              maxLength: { value: 500, message: "Comments must be less than 500 characters" },
            })}
          />
          {errors.comments && (
            <p className="mt-1.5 text-xs text-crimson-light">{errors.comments.message}</p>
          )}
        </div>

        {/* Divider */}
        <div className="editorial-line !w-full !bg-gradient-to-r !from-transparent !via-ash/30 !to-transparent" />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-gold w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-lg cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Feedback
            </>
          )}
        </button>
      </form>
    </div>
  );
}
