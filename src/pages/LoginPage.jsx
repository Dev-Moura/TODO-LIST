/**
 * Login page — the app's entry screen with Google sign-in and the
 * email/password flow (sign-in, sign-up and password recovery).
 */

import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  Link,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import GoogleIcon from "../components/common/GoogleIcon.jsx";
import Logo from "../components/common/Logo.jsx";
import { toAuthMessage, useAuth } from "../context/AuthContext.jsx";
import { useAppTheme } from "../context/ThemeContext.jsx";
import { isFirebaseConfigured } from "../firebase/config";

/**
 * Renders the authentication screen.
 *
 * @returns {JSX.Element} The login page element.
 */
export default function LoginPage() {
  const { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } =
    useAuth();
  const { mode, toggleMode } = useAppTheme();
  const navigate = useNavigate();

  /** Whether the form is in "create account" mode instead of sign-in. */
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  // Already authenticated users don't need this screen.
  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  /**
   * Wraps an async auth operation with shared busy/error state handling.
   * @param {() => Promise<void>} action - Auth operation to run.
   * @returns {Promise<void>}
   */
  async function run(action) {
    setError("");
    setInfo("");
    setBusy(true);
    try {
      await action();
      navigate("/", { replace: true });
    } catch (err) {
      setError(toAuthMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        px: 2,
        bgcolor: "background.default",
      }}
    >
      {/* Theme switch floats in the top-right corner. */}
      <Tooltip title={mode === "light" ? "Tema escuro" : "Tema claro"}>
        <IconButton
          onClick={toggleMode}
          sx={{ position: "fixed", top: 16, right: 16 }}
          aria-label="Alternar tema"
        >
          {mode === "light" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
        </IconButton>
      </Tooltip>

      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: { xs: 3, sm: 5 },
          borderRadius: 5,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack spacing={3} alignItems="center">
          <Logo size={56} />
          <Box textAlign="center">
            <Typography variant="h5">Bem-vindo ao Listo</Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Suas tarefas, organizadas com elegância.
            </Typography>
          </Box>

          {!isFirebaseConfigured && (
            <Alert severity="warning" icon={false}>
              Configure as credenciais do Firebase no arquivo <code>.env</code>{" "}
              para habilitar o login.
            </Alert>
          )}

          <Button
            fullWidth
            size="large"
            variant="outlined"
            color="inherit"
            disabled={!isFirebaseConfigured || busy}
            startIcon={<GoogleIcon />}
            onClick={() => void run(() => signInWithGoogle())}
            sx={{ borderRadius: 999, py: 1.25, textTransform: "none", borderColor: "divider" }}
          >
            Continuar com o Google
          </Button>

          <Divider flexItem>
            <Typography variant="caption" color="text.secondary">
              ou
            </Typography>
          </Divider>

          <Box component="form" onSubmit={(e) => e.preventDefault()} width="100%">
            <Stack spacing={2}>
              <TextField
                label="E-mail"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Senha"
                type="password"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
              />

              {error && (
                <Alert severity="error" onClose={() => setError("")}>
                  {error}
                </Alert>
              )}
              {info && (
                <Alert severity="success" onClose={() => setInfo("")}>
                  {info}
                </Alert>
              )}

              <Button
                variant="contained"
                size="large"
                disabled={!isFirebaseConfigured || busy || !email || !password}
                onClick={() =>
                  void run(() =>
                    isSignUp
                      ? signUpWithEmail(email, password)
                      : signInWithEmail(email, password)
                  )
                }
                sx={{ borderRadius: 999, py: 1.25, textTransform: "none" }}
              >
                {isSignUp ? "Criar conta" : "Entrar"}
              </Button>
            </Stack>
          </Box>

          <Stack direction="row" spacing={3} justifyContent="center">
            <Link
              component="button"
              type="button"
              variant="body2"
              underline="hover"
              onClick={() => {
                setIsSignUp((v) => !v);
                setError("");
              }}
            >
              {isSignUp ? "Já tenho conta" : "Criar uma conta"}
            </Link>
            <Link
              component="button"
              type="button"
              variant="body2"
              underline="hover"
              disabled={busy}
              onClick={async () => {
                if (!email) {
                  setError("Digite seu e-mail para recuperar a senha.");
                  return;
                }
                await run(() => resetPassword(email));
                setInfo("Enviamos um link de recuperação para o seu e-mail.");
              }}
            >
              Esqueci minha senha
            </Link>
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
}
