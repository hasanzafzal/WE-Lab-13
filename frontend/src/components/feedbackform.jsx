import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

function FeedbackForm(){
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: {
      studentName: "",
      subject: "",
      rating: "",
      comments: ""
    }
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const rating = watch("rating");

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/feedback", data);
      setSuccessMsg("✓ Feedback submitted successfully!");
      reset();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      alert("Error submitting feedback: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return(
    <form onSubmit={handleSubmit(onSubmit)} className="card p-4">
      <h3>Submit Feedback</h3>
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <div className="mb-3">
        <label className="form-label">Student Name *</label>
        <input
          className={`form-control ${errors.studentName ? "is-invalid" : ""}`}
          placeholder="Enter your name"
          {...register("studentName", { 
            required: "Name is required",
            minLength: { value: 2, message: "Name must be at least 2 characters" },
            maxLength: { value: 50, message: "Name cannot exceed 50 characters" }
          })}
        />
        {errors.studentName && <div className="invalid-feedback d-block">{errors.studentName.message}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Subject *</label>
        <input
          className={`form-control ${errors.subject ? "is-invalid" : ""}`}
          placeholder="e.g., Mathematics, English"
          {...register("subject", { 
            required: "Subject is required",
            minLength: { value: 2, message: "Subject must be at least 2 characters" },
            maxLength: { value: 30, message: "Subject cannot exceed 30 characters" }
          })}
        />
        {errors.subject && <div className="invalid-feedback d-block">{errors.subject.message}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Rating * {rating && `(${rating}/5)`}</label>
        <input
          type="number"
          className={`form-control ${errors.rating ? "is-invalid" : ""}`}
          placeholder="Rate from 1 to 5"
          min="1"
          max="5"
          {...register("rating", { 
            required: "Rating is required",
            min: { value: 1, message: "Minimum rating is 1" },
            max: { value: 5, message: "Maximum rating is 5" }
          })}
        />
        {errors.rating && <div className="invalid-feedback d-block">{errors.rating.message}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Comments (Optional)</label>
        <textarea
          className={`form-control ${errors.comments ? "is-invalid" : ""}`}
          placeholder="Share your feedback..."
          rows="3"
          {...register("comments", { 
            maxLength: { value: 500, message: "Comments cannot exceed 500 characters" }
          })}
        />
        {errors.comments && <div className="invalid-feedback d-block">{errors.comments.message}</div>}
      </div>

      <button type="submit" className="btn btn-primary w-100" disabled={loading}>
        {loading ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
}

export default FeedbackForm;