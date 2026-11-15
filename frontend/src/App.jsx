
import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Overview from "./pages/Overview";
import Prediction from "./pages/Prediction";
import Analytics from "./pages/Analytics";
import ModelPerformance from "./pages/ModelPerformance";

function App() {
  const [activePage, setActivePage] = useState("prediction");

  const pages = {
    overview: {
      title: "Dashboard Overview",
      description: "An overview of your traffic management system.",
    },
    prediction: {
      title: "Traffic Prediction",
      description: "Predict traffic volume using historical patterns.",
    },
    analytics: {
      title: "Historical Analytics",
      description: "Explore historical traffic patterns and trends.",
    },
    performance: {
      title: "Model Performance",
      description: "Compare machine learning model performance.",
    },
  };

  return (
    <div className="min-h-screen bg-[#080f1d] text-slate-100 md:flex">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="min-w-0 flex-1 p-5 md:p-9">
        <Header
          title={pages[activePage].title}
          description={pages[activePage].description}
        />

        {activePage === "overview" && <Overview />}
        {activePage === "prediction" && <Prediction />}
        {activePage === "analytics" && <Analytics />}
        {activePage === "performance" && <ModelPerformance />}

        <footer className="mt-10 border-t border-slate-800 pt-5 text-center text-xs text-slate-600">
          Smart Traffic Management · Historical Data Driven ML System
        </footer>
      </main>
    </div>
  );
}

export default App;
