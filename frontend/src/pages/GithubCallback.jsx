import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const GithubCallback = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (code) {
      fetch("http://localhost:5000/github/callback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.access_token) {
            localStorage.setItem("userToken", data.access_token);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userEmail", data.email);
            setIsLoggedIn(true);
            toast.success("Login successful!");
            navigate("/predict");
          } else {
            toast.error(data.error || "GitHub login failed");
            navigate("/login");
          }
        })
        .catch((error) => {
          console.error("GitHub callback error:", error);
          toast.error("Server error. Try again.");
          navigate("/login");
        });
    } else {
      toast.error("GitHub login failed. No code received.");
      navigate("/login");
    }
  }, [navigate, setIsLoggedIn]);

  return <div>Loading...</div>;
};

export default GithubCallback;
