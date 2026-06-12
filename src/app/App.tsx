import {useState} from "react";
import {MotionConfig} from "motion/react";
import LoginScreen from "./components/LoginScreen";
import SignupScreen from "./components/SignupScreen";
import {ForgotPasswordScreen} from "./components/ForgotPasswordScreen";
import HomePage from "./components/HomePage";
import {OpeningAnimation} from "./components/OpeningAnimation";
import {WelcomeSuccessScreen} from "./components/WelcomeSuccessScreen";
import {usePreferences} from "./hooks/usePreferences";

type Screen = "opening" | "login" | "signup" | "forgot-password" | "success" | "home";

export default function App() {
    const {preferences} = usePreferences();
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem("isAuthenticated") === "true";
    });
    const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
        return localStorage.getItem("isAuthenticated") === "true" ? "home" : "opening";
    });

    const handleSignIn = () => {
        localStorage.setItem("isAuthenticated", "true");
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
        localStorage.setItem("isAuthenticated", "true");
        setIsAuthenticated(true);
        setCurrentScreen("home");
    };

    const renderScreen = () => {
        if (currentScreen === "opening") {
            return <OpeningAnimation onAnimationComplete={handleOpeningComplete}/>;
        }

        if (currentScreen === "success") {
            return <WelcomeSuccessScreen onComplete={handleWelcomeComplete}/>;
        }

        if (currentScreen === "home" && isAuthenticated) {
            return <HomePage/>;
        }

        if (currentScreen === "login") {
            return (
                <LoginScreen
                    onSignup={() => setCurrentScreen("signup")}
                    onSignIn={handleSignIn}
                    onForgotPassword={() => setCurrentScreen("forgot-password")}
                />
            );
        }

        if (currentScreen === "forgot-password") {
            return <ForgotPasswordScreen onBack={() => setCurrentScreen("login")}/>;
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
    };

    // The user's Reduced motion preference overrides Motion's global config:
    // "always" forces reduced motion everywhere, "user" still honors the OS.
    return (
        <MotionConfig reducedMotion={preferences.reducedMotion ? "always" : "user"}>
            {renderScreen()}
        </MotionConfig>
    );
}