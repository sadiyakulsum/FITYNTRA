import React, { useState } from "react";

import { healthCheck } from "./services/api";

import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProgressPage from "./pages/ProgressPage";
import CommunityPage from "./pages/CommunityPage";

import Dashboard from "./pages/Dashboard";
import DietRecommender from "./pages/DietRecommender";
import Workoutrecommender from "./pages/WorkoutRecommender";
import RehaCoach from "./pages/RehaCoach";

import HealthCalc from "./components/features/HealthCalc";
import MacroTracker from "./components/features/MacroTracker";
import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";
import GlobalStyle from "./components/common/GlobalStyle";

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("fityntra_user");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const token = user?.token || null;
  const userId = user?.id || null;

  const [page, setPage] = useState("dashboard");

  if (!user) {
    return (
      <>
        <GlobalStyle />
        <LoginPage
          onLogin={(u) => {
            localStorage.setItem("fityntra_user", JSON.stringify(u));
            setUser(u);
          }}
        />
      </>
    );
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard userName={user.name} token={token} userId={userId} />;

      case "diet":
        return <DietRecommender token={token} userId={userId} user={user} />;

      case "workout":
        return <WorkoutPlan token={token} userId={userId} user={user} />;

      case "health":
        return (
          <HealthCalc
            onDietRec={() => setPage("diet")}
            onWorkoutRec={() => setPage("workout")}
            token={token}
            userId={userId}
            user={user}
          />
        );

      case "reha":
        return <RehaCoach token={token} userId={userId} />;

      case "macros":
        return <MacroTracker token={token} userId={userId} />;

      case "progress":
        return (
          <ProgressPage
            token={token}
            userId={userId}
            userGoal={user?.goal || "maintain"}
          />
        );

      case "community":
        return <CommunityPage />;

      case "settings":
        return (
          <SettingsPage
            userName={user.name}
            token={token}
            userId={userId}
            user={user}
            onLogout={() => setUser(null)}
            onUpdate={(updatedData) => {
              const updated = { ...user, ...updatedData };
              localStorage.setItem("fityntra_user", JSON.stringify(updated));
              setUser(updated);
            }}
          />
        );

      default:
        return <Dashboard userName={user.name} token={token} userId={userId} />;
    }
  };

  // 🧩 MAIN LAYOUT
  return (
    <>
      <GlobalStyle />

      <div className="app-layout">
        <Sidebar active={page} setActive={setPage} />

        <div className="main-content">
          <TopBar
            userName={user.name}
            activePage={page}
            onLogout={() => {
              localStorage.removeItem("fityntra_user");
              setUser(null);
            }}
            onNavigate={setPage}
          />

          {renderPage()}
        </div>
      </div>
    </>
  );
}