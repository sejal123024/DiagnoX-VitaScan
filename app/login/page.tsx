"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FiMail, FiLock, FiUser, FiArrowLeft } from "react-icons/fi";
import { auth, db } from "../../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const BRAND_COLOR = "#00FFA3"; // Neon Green
const DARK_BG = "#0B0B0B"; // True black

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState("");

  // Form fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  useEffect(() => {
    if (searchParams.get("mode") === "signup") {
      setIsSignUp(true);
    }
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push("/dashboard");
    });
    return () => unsubscribe();
  }, [router]);

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setAuthError("");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError("");
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      // onAuthStateChanged will handle redirect
    } catch (error: any) {
      setIsAuthenticating(false);
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
        setAuthError("Invalid email or password.");
      } else if (error.code === "auth/user-not-found") {
        setAuthError("No account found with this email.");
      } else if (error.code === "auth/too-many-requests") {
        setAuthError("Too many attempts. Try again later.");
      } else {
        setAuthError(error.message);
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      const user = userCredential.user;

      // Set display name
      await updateProfile(user, { displayName: signupName });

      // Create user document in Firestore (matches security rules: data.id == userId)
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        name: signupName,
        email: signupEmail,
        createdAt: serverTimestamp(),
      });

      // onAuthStateChanged will handle redirect
    } catch (error: any) {
      setIsAuthenticating(false);
      if (error.code === "auth/email-already-in-use") {
        setAuthError("An account with this email already exists.");
      } else if (error.code === "auth/weak-password") {
        setAuthError("Password should be at least 6 characters.");
      } else {
        setAuthError(error.message);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create/merge user profile in Firestore for first-time Google users
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        name: user.displayName || "User",
        email: user.email,
        createdAt: serverTimestamp(),
      }, { merge: true });

      // onAuthStateChanged handles redirect
    } catch (error: any) {
      setIsAuthenticating(false);
      if (error.code === "auth/popup-closed-by-user") {
        setAuthError("");
      } else {
        setAuthError(error.message);
      }
    }
  };

  return (
    <div className="login-root overflow-hidden relative">
      
      {/* Particle background container */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-[#00FFA3]/10 blur-[180px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[5%] right-[10%] w-[50%] h-[50%] bg-[#00FFA3]/8 blur-[200px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-[#00FFA3]/5 blur-[100px] rounded-full"></div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .login-root {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #0B0B0B;
            padding: 20px;
            font-family: Arial, Helvetica, sans-serif;
            color: #fff;
        }

        .auth-wrapper {
            position: relative;
            width: 100%;
            max-width: 800px;
            height: 540px;
            background: rgba(11, 11, 11, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(0, 255, 163, 0.4);
            box-shadow: 0 0 40px rgba(0, 255, 163, 0.3), 0 0 80px rgba(0, 255, 163, 0.15), 0 0 120px rgba(0, 255, 163, 0.08), inset 0 0 25px rgba(0, 255, 163, 0.06);
            overflow: hidden;
            animation: wrapper-glow 4s ease-in-out infinite alternate;
            border-radius: 20px;
            z-index: 10;
        }

        .auth-wrapper::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(0,255,163,0.1) 0%, transparent 50%, rgba(0,255,163,0.05) 100%);
            pointer-events: none;
        }

        .auth-wrapper .credentials-panel {
            position: absolute;
            top: 0;
            width: 50%;
            height: 100%;
            display: flex;
            justify-content: center;
            flex-direction: column;
        }

        .credentials-panel.signin {
            left: 0;
            padding: 0 40px;
            z-index: 20;
        }

        .credentials-panel.signin .slide-element {
            transform: translateX(0%);
            transition: .7s;
            opacity: 1;
        }

        .credentials-panel.signin .slide-element:nth-child(1) { transition-delay: 2.1s; }
        .credentials-panel.signin .slide-element:nth-child(2) { transition-delay: 2.2s; }
        .credentials-panel.signin .slide-element:nth-child(3) { transition-delay: 2.3s; }
        .credentials-panel.signin .slide-element:nth-child(4) { transition-delay: 2.4s; }
        .credentials-panel.signin .slide-element:nth-child(5) { transition-delay: 2.5s; }
        .credentials-panel.signin .slide-element:nth-child(6) { transition-delay: 2.6s; }

        .auth-wrapper.toggled .credentials-panel.signin .slide-element {
            transform: translateX(-120%);
            opacity: 0;
        }

        .auth-wrapper.toggled .credentials-panel.signin .slide-element:nth-child(1) { transition-delay: 0s; }
        .auth-wrapper.toggled .credentials-panel.signin .slide-element:nth-child(2) { transition-delay: 0.1s; }
        .auth-wrapper.toggled .credentials-panel.signin .slide-element:nth-child(3) { transition-delay: 0.2s; }
        .auth-wrapper.toggled .credentials-panel.signin .slide-element:nth-child(4) { transition-delay: 0.3s; }
        .auth-wrapper.toggled .credentials-panel.signin .slide-element:nth-child(5) { transition-delay: 0.4s; }
        .auth-wrapper.toggled .credentials-panel.signin .slide-element:nth-child(6) { transition-delay: 0.5s; }

        .credentials-panel.signup {
            right: 0;
            padding: 0 60px;
            z-index: 20;
        }

        .credentials-panel.signup .slide-element {
            transform: translateX(120%);
            transition: .7s ease;
            opacity: 0;
            filter: blur(10px);
        }

        .credentials-panel.signup .slide-element:nth-child(1) { transition-delay: 0s; }
        .credentials-panel.signup .slide-element:nth-child(2) { transition-delay: 0.1s; }
        .credentials-panel.signup .slide-element:nth-child(3) { transition-delay: 0.2s; }
        .credentials-panel.signup .slide-element:nth-child(4) { transition-delay: 0.3s; }
        .credentials-panel.signup .slide-element:nth-child(5) { transition-delay: 0.4s; }
        .credentials-panel.signup .slide-element:nth-child(6) { transition-delay: 0.5s; }
        .credentials-panel.signup .slide-element:nth-child(7) { transition-delay: 0.6s; }

        .auth-wrapper.toggled .credentials-panel.signup .slide-element {
            transform: translateX(0%);
            opacity: 1;
            filter: blur(0px);
        }

        .auth-wrapper.toggled .credentials-panel.signup .slide-element:nth-child(1) { transition-delay: 1.7s; }
        .auth-wrapper.toggled .credentials-panel.signup .slide-element:nth-child(2) { transition-delay: 1.8s; }
        .auth-wrapper.toggled .credentials-panel.signup .slide-element:nth-child(3) { transition-delay: 1.9s; }
        .auth-wrapper.toggled .credentials-panel.signup .slide-element:nth-child(4) { transition-delay: 1.9s; }
        .auth-wrapper.toggled .credentials-panel.signup .slide-element:nth-child(5) { transition-delay: 2.0s; }
        .auth-wrapper.toggled .credentials-panel.signup .slide-element:nth-child(6) { transition-delay: 2.1s; }
        .auth-wrapper.toggled .credentials-panel.signup .slide-element:nth-child(7) { transition-delay: 2.2s; }

        .credentials-panel h2 {
            font-size: 32px;
            text-align: center;
            color: #fff;
            margin-bottom: 10px;
            font-weight: 300;
        }

        .credentials-panel .field-wrapper {
            position: relative;
            width: 100%;
            height: 50px;
            margin-top: 25px;
        }

        .field-wrapper input {
            width: 100%;
            height: 100%;
            background: transparent;
            border: none;
            outline: none;
            font-size: 16px;
            color: #fff;
            font-weight: 400;
            border-bottom: 1px solid rgba(255,255,255,0.3);
            padding-right: 23px;
            transition: .5s;
        }

        .field-wrapper input:focus,
        .field-wrapper input:valid {
            border-bottom: 1px solid ${BRAND_COLOR};
            box-shadow: 0 5px 15px -10px ${BRAND_COLOR};
        }

        .field-wrapper label {
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            font-size: 14px;
            color: rgba(255,255,255,0.6);
            transition: .5s;
            pointer-events: none;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .field-wrapper input:focus~label,
        .field-wrapper input:valid~label {
            top: -10px;
            color: ${BRAND_COLOR};
            font-size: 11px;
            text-shadow: 0 0 5px rgba(0,255,163,0.5);
        }

        .field-wrapper i, .field-wrapper svg {
            position: absolute;
            top: 50%;
            right: 0;
            font-size: 18px;
            transform: translateY(-50%);
            color: rgba(255,255,255,0.5);
        }

        .field-wrapper input:focus~svg,
        .field-wrapper input:valid~svg {
            color: ${BRAND_COLOR};
        }

        .submit-button {
            position: relative;
            width: 100%;
            height: 45px;
            background: transparent;
            border-radius: 40px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            border: 1px solid ${BRAND_COLOR};
            overflow: hidden;
            z-index: 1;
            margin-top: 30px;
            color: #fff;
            letter-spacing: 2px;
            text-transform: uppercase;
            box-shadow: 0 0 10px rgba(0,255,163,0.2);
        }

        .submit-button::before {
            content: "";
            position: absolute;
            height: 300%;
            width: 100%;
            background: linear-gradient(${DARK_BG}, ${BRAND_COLOR}, ${DARK_BG}, ${BRAND_COLOR});
            top: -100%;
            left: 0;
            z-index: -1;
            transition: .5s;
            opacity: 0.3;
        }

        .submit-button:hover:before {
            top: 0;
            opacity: 0.5;
        }
        
        .submit-button:hover {
            box-shadow: 0 0 25px rgba(0,255,163,0.5);
            text-shadow: 0 0 5px #fff;
        }

        .submit-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .switch-link {
            font-size: 12px;
            text-align: center;
            margin: 20px 0 10px;
            color: rgba(255,255,255,0.6);
            letter-spacing: 1px;
        }

        .switch-link button {
            background: none;
            border: none;
            font-size: 13px;
            text-decoration: none;
            color: ${BRAND_COLOR};
            font-weight: 600;
            cursor: pointer;
            margin-left: 5px;
            text-shadow: 0 0 5px rgba(0,255,163,0.3);
        }

        .switch-link button:hover {
            text-decoration: underline;
        }

        .welcome-section {
            position: absolute;
            top: 0;
            height: 100%;
            width: 50%;
            display: flex;
            justify-content: center;
            flex-direction: column;
            z-index: 10;
        }

        .welcome-section.signin {
            right: 0;
            text-align: right;
            padding: 0 40px 60px 150px;
            pointer-events: none;
        }

        .welcome-section.signin .slide-element {
            transform: translateX(0);
            transition: .7s ease;
            opacity: 1;
            filter: blur(0px);
        }

        .welcome-section.signin .slide-element:nth-child(1) { transition-delay: 2.0s; }
        .welcome-section.signin .slide-element:nth-child(2) { transition-delay: 2.1s; }

        .auth-wrapper.toggled .welcome-section.signin .slide-element {
            transform: translateX(120%);
            opacity: 0;
            filter: blur(10px);
        }

        .auth-wrapper.toggled .welcome-section.signin .slide-element:nth-child(1) { transition-delay: 0s; }
        .auth-wrapper.toggled .welcome-section.signin .slide-element:nth-child(2) { transition-delay: 0.1s; }

        .welcome-section.signup {
            left: 0;
            text-align: left;
            padding: 0 150px 60px 38px;
            pointer-events: none;
        }

        .welcome-section.signup .slide-element {
            transform: translateX(-120%);
            transition: .7s ease;
            opacity: 0;
            filter: blur(10px);
        }

        .welcome-section.signup .slide-element:nth-child(1) { transition-delay: 0s; }
        .welcome-section.signup .slide-element:nth-child(2) { transition-delay: 0.1s; }

        .auth-wrapper.toggled .welcome-section.signup .slide-element {
            transform: translateX(0%);
            opacity: 1;
            filter: blur(0);
        }

        .auth-wrapper.toggled .welcome-section.signup .slide-element:nth-child(1) { transition-delay: 1.7s; }
        .auth-wrapper.toggled .welcome-section.signup .slide-element:nth-child(2) { transition-delay: 1.8s; }

        .welcome-section h2 {
            font-size: 36px;
            line-height: 1.2;
            color: #fff;
            font-weight: 300;
            letter-spacing: -1px;
        }

        .welcome-section p {
            font-size: 14px;
            color: rgba(255,255,255,0.5);
            margin-top: 10px;
            letter-spacing: 1px;
        }

        .auth-wrapper .background-shape {
            position: absolute;
            right: 0;
            top: -5px;
            height: 600px;
            width: 850px;
            background: linear-gradient(45deg, #050505, rgba(0,255,163,0.15));
            transform: rotate(10deg) skewY(40deg);
            transform-origin: bottom right;
            transition: 1.5s cubic-bezier(0.4, 0, 0.2, 1);
            transition-delay: 1.6s;
            z-index: 5;
            box-shadow: -20px 0 50px rgba(0,0,0,0.5);
        }

        .auth-wrapper.toggled .background-shape {
            transform: rotate(0deg) skewY(0deg);
            transition-delay: .5s;
        }

        .auth-wrapper .secondary-shape {
            position: absolute;
            left: 250px;
            top: 100%;
            height: 700px;
            width: 850px;
            background: #0B0B0B;
            border-top: 1px solid rgba(0,255,163,0.3);
            box-shadow: 0 -10px 50px rgba(0,255,163,0.1);
            transform: rotate(0deg) skewY(0deg);
            transform-origin: bottom left;
            transition: 1.5s cubic-bezier(0.4, 0, 0.2, 1);
            transition-delay: .5s;
            z-index: 5;
        }

        .auth-wrapper.toggled .secondary-shape {
            transform: rotate(-11deg) skewY(-41deg);
            transition-delay: 1.2s;
        }
        
        /* Face Scan Overlay Animation */
        .face-scan-overlay {
            position: absolute;
            inset: 0;
            background: rgba(11,11,11,0.9);
            z-index: 100;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
        }

        .face-scan-frame {
            width: 150px;
            height: 150px;
            border: 2px solid rgba(0,255,163,0.2);
            border-radius: 20px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 0 30px rgba(0,255,163,0.2), inset 0 0 20px rgba(0,255,163,0.1);
        }
        
        .face-scan-frame::before {
            content: '';
            position: absolute;
            top: -50%; left: 0; right: 0; height: 100%;
            background: linear-gradient(transparent, rgba(0,255,163,0.5), transparent);
            animation: scan-line 1.5s linear infinite;
        }
        
        .face-scan-corners {
            position: absolute;
            inset: -2px;
        }
        .face-scan-corners::before, .face-scan-corners::after {
            content: ''; position: absolute; width: 20px; height: 20px; border: 2px solid #00FFA3;
        }
        .face-scan-corners::before { top: 0; left: 0; border-right: none; border-bottom: none; border-radius: 20px 0 0 0; }
        .face-scan-corners::after { top: 0; right: 0; border-left: none; border-bottom: none; border-radius: 0 20px 0 0; }
        
        .face-scan-corners-bottom {
            position: absolute;
            inset: -2px;
        }
        .face-scan-corners-bottom::before, .face-scan-corners-bottom::after {
            content: ''; position: absolute; width: 20px; height: 20px; border: 2px solid #00FFA3;
        }
        .face-scan-corners-bottom::before { bottom: 0; left: 0; border-top: none; border-right: none; border-radius: 0 0 0 20px; }
        .face-scan-corners-bottom::after { bottom: 0; right: 0; border-top: none; border-left: none; border-radius: 0 0 20px 0; }

        .auth-error {
            text-align: center;
            color: #ff4444;
            font-size: 12px;
            margin-top: 10px;
            letter-spacing: 0.5px;
            text-shadow: 0 0 10px rgba(255,68,68,0.3);
        }

        .google-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            height: 42px;
            margin-top: 12px;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 40px;
            color: rgba(255, 255, 255, 0.8);
            font-size: 13px;
            font-weight: 500;
            letter-spacing: 1px;
            cursor: pointer;
            transition: all 0.4s ease;
            backdrop-filter: blur(10px);
        }

        .google-btn:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(0, 255, 163, 0.4);
            box-shadow: 0 0 20px rgba(0, 255, 163, 0.15), 0 0 40px rgba(0, 255, 163, 0.05);
            color: #fff;
        }

        .google-btn:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }

        .field-wrapper input:focus {
            box-shadow: 0 5px 25px -10px ${BRAND_COLOR}, 0 0 15px rgba(0,255,163,0.1);
        }

        @keyframes scan-line {
            0% { transform: translateY(0); }
            100% { transform: translateY(200%); }
        }

        @keyframes wrapper-glow {
            0% {
                box-shadow: 0 0 40px rgba(0, 255, 163, 0.25), 0 0 80px rgba(0, 255, 163, 0.12), 0 0 120px rgba(0, 255, 163, 0.06), inset 0 0 25px rgba(0, 255, 163, 0.04);
                border-color: rgba(0, 255, 163, 0.3);
            }
            100% {
                box-shadow: 0 0 50px rgba(0, 255, 163, 0.4), 0 0 100px rgba(0, 255, 163, 0.2), 0 0 150px rgba(0, 255, 163, 0.1), inset 0 0 35px rgba(0, 255, 163, 0.08);
                border-color: rgba(0, 255, 163, 0.5);
            }
        }
      `}} />
      
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-[#00FFA3] transition-colors z-50 text-sm tracking-widest uppercase">
        <FiArrowLeft className="text-xl" />
        <span>Return</span>
      </Link>

      <div className={`auth-wrapper ${isSignUp ? 'toggled' : ''}`}>
        
        <div className="background-shape"></div>
        <div className="secondary-shape"></div>

        {/* AUTHENTICATING OVERLAY */}
        {isAuthenticating && (
          <div className="face-scan-overlay">
            <div className="face-scan-frame">
               <div className="face-scan-corners"></div>
               <div className="face-scan-corners-bottom"></div>
               <div className="w-full h-full flex items-center justify-center opacity-30">
                  <FiUser className="text-6xl text-[#00FFA3]" />
               </div>
            </div>
            <h3 className="text-[#00FFA3] mt-8 text-sm tracking-[0.3em] uppercase animate-pulse">Running Neural Scan</h3>
            <p className="text-gray-500 text-xs mt-2">Authenticating Bio-Identity</p>
          </div>
        )}

        {/* ================= WELCOME SIGNIN ================= */}
        <div className="welcome-section signin">
            <div className="slide-element">
               <h2>Neural<br/><span style={{ fontWeight: 700, color: '#00FFA3' }}>Entry</span></h2>
               <p>Welcome back to VitaScan. Prepare for analysis.</p>
            </div>
        </div>

        {/* ================= WELCOME SIGNUP ================= */}
        <div className="welcome-section signup">
            <div className="slide-element">
               <h2>Start<br/><span style={{ fontWeight: 700, color: '#00FFA3' }}>Scanning</span></h2>
               <p>Initialize your bio-profile with VitaScan.</p>
            </div>
        </div>

        {/* ================= SIGN IN PANEL ================= */}
        <form className="credentials-panel signin" onSubmit={handleSignIn}>
            <h2 className="slide-element">Login</h2>
            
            <div className="field-wrapper slide-element">
                <input 
                  type="email" 
                  required 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
                <label>Neural Email ID</label>
                <FiUser />
            </div>

            <div className="field-wrapper slide-element">
                <input 
                  type="password" 
                  required 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <label>Access Code</label>
                <FiLock />
            </div>

            {authError && !isSignUp && <div className="auth-error slide-element">{authError}</div>}

            <button type="submit" className="submit-button slide-element" disabled={isAuthenticating}>
              {isAuthenticating ? "Scanning..." : "Initialize"}
            </button>

            <button type="button" onClick={handleGoogleSignIn} disabled={isAuthenticating} className="google-btn slide-element">
              <FcGoogle className="text-xl" />
              <span>Sign in with Google</span>
            </button>
            
            <div className="switch-link slide-element">
                Unregistered bio-profile?
                <button type="button" onClick={toggleMode}>Sign Up</button>
            </div>
        </form>

        {/* ================= SIGN UP PANEL ================= */}
        <form className="credentials-panel signup" onSubmit={handleSignUp}>
            <h2 className="slide-element">Register</h2>
            
            <div className="field-wrapper slide-element">
                <input 
                  type="text" 
                  required 
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                />
                <label>Full Name</label>
                <FiUser />
            </div>

            <div className="field-wrapper slide-element">
                <input 
                  type="email" 
                  required 
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                />
                <label>Email Address</label>
                <FiMail />
            </div>

            <div className="field-wrapper slide-element">
                <input 
                  type="password" 
                  required 
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                />
                <label>Create Access Code</label>
                <FiLock />
            </div>

            {authError && isSignUp && <div className="auth-error slide-element">{authError}</div>}

            <button type="submit" className="submit-button slide-element" disabled={isAuthenticating}>
              {isAuthenticating ? "Creating Profile..." : "Start Scanning"}
            </button>

            <button type="button" onClick={handleGoogleSignIn} disabled={isAuthenticating} className="google-btn slide-element">
              <FcGoogle className="text-xl" />
              <span>Sign up with Google</span>
            </button>
            
            <div className="switch-link slide-element">
                Registered bio-profile?
                <button type="button" onClick={toggleMode}>Sign In</button>
            </div>
        </form>

      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-bold text-2xl tracking-widest">LOADING...</div>}>
      <LoginContent />
    </Suspense>
  );
}
