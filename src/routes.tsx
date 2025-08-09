import { RouteObject, Navigate } from "react-router-dom";
import Shell from "./shell";
import AuthGuard from "./AuthGuard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Welcome from "./pages/Welcome";
import Quiz from "./pages/Quiz";
import Report from "./pages/Report";
import Planner from "./pages/Planner";
import Affirmations from "./pages/Affirmations";
import Achievements from "./pages/Achievements";
import Inspiration from "./pages/Inspiration";
import Profile from "./pages/Profile";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/welcome" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/welcome",
    element: <Welcome />,
  },
  {
    path: "/",
    element: <Shell />,
    children: [
      {
        path: "home",
        element: (
          <AuthGuard>
            <Home />
          </AuthGuard>
        ),
      },
      {
        path: "quiz",
        element: (
          <AuthGuard>
            <Quiz />
          </AuthGuard>
        ),
      },
      {
        path: "report",
        element: (
          <AuthGuard>
            <Report />
          </AuthGuard>
        ),
      },
      {
        path: "planner",
        element: (
          <AuthGuard>
            <Planner />
          </AuthGuard>
        ),
      },
      {
        path: "affirmations",
        element: (
          <AuthGuard>
            <Affirmations />
          </AuthGuard>
        ),
      },
      {
        path: "achievements",
        element: (
          <AuthGuard>
            <Achievements />
          </AuthGuard>
        ),
      },
      {
        path: "inspiration",
        element: (
          <AuthGuard>
            <Inspiration />
          </AuthGuard>
        ),
      },
      {
        path: "profile",
        element: (
          <AuthGuard>
            <Profile />
          </AuthGuard>
        ),
      },
    ],
  },
];

export default routes;
