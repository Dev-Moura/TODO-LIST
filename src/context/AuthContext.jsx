/**
 * Authentication context — wraps Firebase Auth and exposes sign-in /
 * sign-up / recovery / logout helpers with user-friendly error messages.
 */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";

/**
 * @typedef {Object} AuthContextValue
 * @property {import("firebase/auth").User|null} user - Signed-in user or null.
 * @property {boolean} loading - True while the initial session is resolving.
 * @property {() => Promise<void>} signInWithGoogle - Opens the Google popup flow.
 * @property {(email: string, password: string) => Promise<void>} signUpWithEmail - Creates an account.
 * @property {(email: string, password: string) => Promise<void>} signInWithEmail - Signs in with email/password.
 * @property {(email: string) => Promise<void>} resetPassword - Sends a recovery email.
 * @property {() => Promise<void>} logout - Signs the user out.
 */

/** React context holding the auth state and actions. */
const AuthContext = createContext(null);

/**
 * Maps Firebase auth error codes to short, friendly pt-BR messages.
 * @param {unknown} error - Error thrown by a Firebase Auth call.
 * @returns {string} A message suitable for display in the UI.
 */
export function toAuthMessage(error) {
  const code =
    typeof error === "object" && error !== null ? error.code : undefined;
  switch (code) {
    case "auth/invalid-email":
      return "E-mail inválido.";
    case "auth/missing-password":
      return "Informe sua senha.";
    case "auth/weak-password":
      return "A senha precisa ter pelo menos 6 caracteres.";
    case "auth/email-already-in-use":
      return "Este e-mail já possui uma conta. Faça login.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "E-mail ou senha incorretos.";
    case "auth/too-many-requests":
      return "Muitas tentativas. Tente novamente em instantes.";
    case "auth/popup-closed-by-user":
      return "Login com Google cancelado.";
    case "auth/network-request-failed":
      return "Sem conexão com a internet.";
    case "auth/operation-not-allowed":
      return "Método de login desativado no projeto do Firebase.";
    default:
      return "Não foi possível concluir a operação. Tente novamente.";
  }
}

/**
 * Provides authentication state and actions to the app subtree.
 *
 * @param {Object} props - Component props.
 * @param {import("react").ReactNode} props.children - App subtree.
 * @returns {JSX.Element} The auth provider tree.
 */
export function AuthProvider({ children }) {
  /** @type {[import("firebase/auth").User|null, Function]} */
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Keep `user` in sync with Firebase's session, including persistence.
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (current) => {
      setUser(current);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,

      /** Opens the Google account chooser in a popup window. */
      async signInWithGoogle() {
        await signInWithPopup(auth, googleProvider);
      },

      /** Registers a new user with email and password. */
      async signUpWithEmail(email, password) {
        await createUserWithEmailAndPassword(auth, email, password);
      },

      /** Signs in an existing email/password user. */
      async signInWithEmail(email, password) {
        await signInWithEmailAndPassword(auth, email, password);
      },

      /** Sends the password reset email for the given address. */
      async resetPassword(email) {
        await sendPasswordResetEmail(auth, email);
      },

      /** Signs out the current session. */
      async logout() {
        await signOut(auth);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Accesses authentication state and actions.
 * @returns {AuthContextValue} User, loading flag and auth operations.
 * @throws {Error} When used outside of {@link AuthProvider}.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
