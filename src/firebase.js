import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC1juz3QKkVgFYwmHbidQZWxYuLIbOiTLE",
  authDomain: "fir-otp-app-17d94.firebaseapp.com",
  projectId: "fir-otp-app-17d94",
  appId: "1:758427968171:web:e2fa7aa3afb7020e5b4dee",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
