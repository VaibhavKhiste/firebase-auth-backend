import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import.meta.env.VITE_API_BASE_URL

function App() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmObj, setConfirmObj] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ AUTO LOGIN (if token exists)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  const generateRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
        size: "invisible",
      });
    }
  };

  const sendOTP = async () => {
    if (!phone) {
      alert("Enter phone number");
      return;
    }

    setLoading(true);

    try {
      generateRecaptcha();
      const appVerifier = window.recaptchaVerifier;

      const confirmation = await signInWithPhoneNumber(
        auth,
        phone,
        appVerifier
      );

      console.log("CONFIRM OBJECT:", confirmation);

      setConfirmObj(confirmation);
      alert("OTP Sent");

    } catch (err) {
      console.error("SEND OTP ERROR:", err);
      alert("Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!confirmObj) {
      alert("Please click 'Send OTP' first");
      return;
    }

    if (!otp) {
      alert("Enter OTP");
      return;
    }

    setLoading(true);

    try {
      const result = await confirmObj.confirm(otp);

      const token = await result.user.getIdToken();
      console.log("TOKEN:", token);

      // ✅ STORE TOKEN
      localStorage.setItem("token", token);

      const response = await fetch("http://localhost:8080/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Backend error: " + response.status);
      }

      const data = await response.json();
      console.log("BACKEND RESPONSE:", data);

      if (data.status === "success") {
        // ✅ STORE USER DATA
        localStorage.setItem("user", JSON.stringify(data));

        setLoggedIn(true);
      } else {
        alert("Backend verification failed: " + data.message);
      }

    } catch (err) {
      console.error("FULL ERROR:", err);

      if (err.code === "auth/invalid-verification-code") {
        alert("Invalid OTP");
      } else {
        alert("Backend / Network Error");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOGOUT FUNCTION
  const logout = () => {
    localStorage.clear();
    setLoggedIn(false);
    setPhone("");
    setOtp("");
    setConfirmObj(null);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Firebase OTP Login</h2>

      {!loggedIn ? (
        <>
          <input
            placeholder="+91XXXXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button onClick={sendOTP} disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>

          <br /><br />

          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOTP} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      ) : (
        <>
          <h3>Login Successful ✅</h3>

          {/* ✅ SHOW USER INFO */}
          <div>
            <p><b>Phone:</b> {JSON.parse(localStorage.getItem("user"))?.phone}</p>
            <p><b>UID:</b> {JSON.parse(localStorage.getItem("user"))?.uid}</p>
          </div>

          <button onClick={logout}>Logout</button>
        </>
      )}

      <div id="recaptcha"></div>
    </div>
  );
}

export default App;