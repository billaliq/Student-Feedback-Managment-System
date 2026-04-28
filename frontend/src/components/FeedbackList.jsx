import { useState, useEffect, useCallback } from "react";
import { getAllFeedbacks, getFeedbacksBySubject, deleteFeedback } from "../api";
import {
  Search,
  Star,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Loader2,
  BarChart3,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchSubject, setSearchSubject] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [averageRating, setAverageRating] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPages: 0,
  });

  const fetchFeedbacks = useCallback(async (subject = "", page = 1) => {
    setLoading(true);
    try {
      let data;
      if (subject.trim()) {
        data = await getFeedbacksBySubject(subject.trim(), page, 8);
        setAverageRating(data.averageRating);
      } else {
        data = await getAllFeedbacks(page, 8);
        setAverageRating(null);
      }
      setFeedbacks(data.data);
      setPagination(data.pagination);
    } catch (error) {
      toast.error("Failed to load feedbacks");
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks(activeFilter, 1);
  }, [activeFilter, fetchFeedbacks]);

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveFilter(searchSubject);
  };

  const handleClearFilter = () => {
    setSearchSubject("");
    setActiveFilter("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    try {
      await deleteFeedback(id);
      toast.success("Feedback deleted");
      fetchFeedbacks(activeFilter, pagination.page);
    } catch {
      toast.error("Failed to delete feedback");
    }
  };

  const handlePageChange = (newPage) => {
    fetchFeedbacks(activeFilter, newPage);
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${
          i < rating ? "fill-gold text-gold" : "text-ash"
        }`}
      />
    ));

  return (
    <div className="max-w-6xl mx-auto relative z-10">
      {/* Header */}
      <div className="text-center mb-10 animate-fade-in-up">
        <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4 font-medium">Administration</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-champagne mb-3 leading-tight">
          Feedback Dashboard
        </h1>
        <div className="editorial-line mt-5" />
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-8 animate-fade-in-up stagger-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-smoke/50" />
          <input
            type="text"
            placeholder="Filter by subject..."
            value={searchSubject}
            onChange={(e) => setSearchSubject(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-charcoal-light/60 border border-ash/40 rounded-lg text-sm text-champagne placeholder-smoke/40 outline-none focus:ring-1 focus:ring-gold/20 focus:border-gold/40 transition-all duration-300"
          />
        </div>
        <button
          type="submit"
          className="btn-gold px-6 py-3 rounded-lg cursor-pointer"
        >
          Search
        </button>
        {activeFilter && (
          <button
            type="button"
            onClick={handleClearFilter}
            className="flex items-center gap-1.5 px-5 py-3 bg-onyx border border-ash/40 text-smoke text-xs font-medium tracking-widest uppercase rounded-lg hover:border-gold/30 hover:text-gold-light transition-all duration-300 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </form>

      {/* Average Rating Banner */}
      {averageRating !== null && activeFilter && (
        <div className="mb-8 glass-card rounded-xl p-6 flex items-center justify-between animate-fade-in-up">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold/[0.08] border border-gold/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-gold" />
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-smoke mb-1">
                Average Rating for <span className="text-gold font-medium">{activeFilter}</span>
              </p>
              <div className="flex items-center gap-3">
                <span className="font-serif text-3xl text-champagne">{averageRating}</span>
                <span className="text-smoke/40 text-sm">/5</span>
                <div className="flex ml-1 gap-0.5">{renderStars(Math.round(averageRating))}</div>
              </div>
            </div>
          </div>
          <span className="text-xs tracking-widest uppercase text-smoke">{pagination.total} entries</span>
        </div>
      )}

      {/* Feedback Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-gold mb-4" />
          <p className="text-sm text-smoke/60 tracking-wide">Loading feedbacks...</p>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center py-24 animate-fade-in">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-ash" />
          <p className="font-serif text-xl text-champagne/60 mb-1">No feedbacks found</p>
          <p className="text-sm text-smoke/40">
            {activeFilter
              ? `No entries for "${activeFilter}"`
              : "No feedback entries yet"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            {feedbacks.map((fb, index) => (
              <div
                key={fb._id}
                className={`glass-card rounded-xl p-6 animate-fade-in-up stagger-${Math.min(index + 1, 5)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-serif text-lg text-champagne">{fb.studentName}</h3>
                    <span className="inline-block mt-1.5 text-[10px] font-medium tracking-widest uppercase px-3 py-1 rounded-full border border-gold/20 text-gold/80 bg-gold/[0.04]">
                      {fb.subject}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(fb._id)}
                    className="p-2 rounded-lg text-ash hover:text-crimson-light hover:bg-crimson/10 transition-all duration-300 cursor-pointer"
                    title="Delete feedback"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-1 mb-4">{renderStars(fb.rating)}</div>
                {fb.comments && (
                  <p className="text-sm text-mist/80 leading-relaxed italic">&ldquo;{fb.comments}&rdquo;</p>
                )}
                <div className="mt-4 pt-3 border-t border-ash/20">
                  <p className="text-[10px] tracking-widest uppercase text-smoke/50">
                    {new Date(fb.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12 animate-fade-in">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-medium tracking-widest uppercase rounded-lg border border-ash/40 text-smoke hover:border-gold/30 hover:text-gold-light disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <span className="text-xs tracking-widest uppercase text-smoke/50">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-medium tracking-widest uppercase rounded-lg border border-ash/40 text-smoke hover:border-gold/30 hover:text-gold-light disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
