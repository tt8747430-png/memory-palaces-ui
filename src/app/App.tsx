import { useState } from "react";
import LoginScreen from "./components/LoginScreen";
import SignupScreen from "./components/SignupScreen";
import HomePage from "./components/HomePage";
import { OpeningAnimation } from "./components/OpeningAnimation";
import { WelcomeSuccessScreen } from "./components/WelcomeSuccessScreen";

type Screen = "opening" | "login" | "signup" | "success" | "home";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("opening");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignIn = () => {
    setIsAuthenticated(true);
    setCurrentScreen("home");
  };

  const handleSignUp = () => {
    setCurrentScreen("success");
  };

  const handleOpeningComplete = () => {
    setCurrentScreen("login");
  };

  const handleWelcomeComplete = () => {
    setIsAuthenticated(true);
    setCurrentScreen("home");
  };

  if (currentScreen === "opening") {
    return <OpeningAnimation onAnimationComplete={handleOpeningComplete} />;
  }

  if (currentScreen === "success") {
    return <WelcomeSuccessScreen onComplete={handleWelcomeComplete} />;
  }

  if (currentScreen === "home" && isAuthenticated) {
    return <HomePage />;
  }

  if (currentScreen === "login") {
    return (
      <LoginScreen
        onSignup={() => setCurrentScreen("signup")}
        onSignIn={handleSignIn}
      />
    );
  }

  if (currentScreen === "signup") {
    return (
      <SignupScreen
        onClose={() => setCurrentScreen("login")}
        onLogin={() => setCurrentScreen("login")}
        onSignUp={handleSignUp}
      />
    );
  }

  return null;
}