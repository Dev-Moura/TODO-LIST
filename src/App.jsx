/**
 * App root — wires providers (theme, auth) and the route table:
 * `/login` is public, everything else requires authentication.
 */

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProviderWrapper } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import TasksPage from "./pages/TasksPage.jsx";

/**
 * Renders the provider tree and application routes.
 *
 * @returns {JSX.Element} The complete app element.
 */
export default function App() {
  return (
    <ThemeProviderWrapper>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <TasksPage />
                </ProtectedRoute>
              }
            />
            {/* Unknown paths fall back to the home view. */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProviderWrapper>
  );
}
