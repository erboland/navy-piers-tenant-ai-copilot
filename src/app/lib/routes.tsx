import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginScreen } from "../screens/login";
import { HomeScreen } from "../screens/home";
import { QuickInfoScreen } from "../screens/quick-info";
import { ChatScreen } from "../screens/chat";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LoginScreen />,
  },
  {
    path: "/home",
    element: <HomeScreen />,
  },
  {
    path: "/quick-info",
    element: <QuickInfoScreen />,
  },
  {
    path: "/chat",
    element: <ChatScreen />,
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
