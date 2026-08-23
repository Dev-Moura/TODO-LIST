/**
 * Route guard — renders its children only for authenticated users and
 * redirects everyone else to the login screen.
 */

import { Navigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Logo from "../common/Logo.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

/**
 * Protects a route subtree from unauthenticated access.
 *
 * While the Firebase session is still resolving, a branded splash is shown;
 * once resolved, anonymous visitors are redirected to `/login`.
 *
 * @param {Object} props - Component props.
 * @param {import("react").ReactNode} props.children - Protected subtree.
 * @returns {JSX.Element} Splash, redirect or the protected subtree.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Stack
        spacing={2}
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "100dvh", bgcolor: "background.default" }}
      >
        <Logo size={48} />
        <CircularProgress size={24} sx={{ mt: 1 }} />
        <Typography variant="body2" color="text.secondary">
          Carregando suas tarefas…
        </Typography>
      </Stack>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
