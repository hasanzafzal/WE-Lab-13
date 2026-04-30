import FeedbackForm from "./components/feedbackform.jsx";
import FeedbackList from "./components/feedbacklist.jsx";
import AdminLogin from "./components/AdminLogin.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

function App() {
  return (
    <AuthProvider>
      <div className="container mt-5">
        <h1 className="text-center mb-4">📚 Student Feedback System</h1>
        
        <div className="row">
          <div className="col-md-6">
            <FeedbackForm />
          </div>
          <div className="col-md-6">
            <AdminLogin />
          </div>
        </div>
        
        <hr />
        <FeedbackList />
      </div>
    </AuthProvider>
  );
}

export default App;