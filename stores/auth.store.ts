// import { create } from "zustand";
// import type { AuthUser } from "@/types/auth.type";

// type AuthStatus =
//   | "loading"
//   | "authenticated"
//   | "unauthenticated";

// interface AuthState {
//   user: AuthUser | null;
//   csrfToken: string | null;
//   status: AuthStatus;

//   setSession: (user: AuthUser, csrfToken: string) => void;
//   setUser: (user: AuthUser) => void;
//   setCsrfToken: (csrfToken: string) => void;
//   setUnauthenticated: () => void;
//   clearSession: () => void;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   csrfToken: null,
//   status: "loading",

//   setSession: (user, csrfToken) =>
//     set({
//       user,
//       csrfToken,
//       status: "authenticated",
//     }),

//   setUser: (user) =>
//     set({
//       user,
//       status: "authenticated",
//     }),

//   setCsrfToken: (csrfToken) => set({ csrfToken }),

//   setUnauthenticated: () =>
//     set({
//       user: null,
//       csrfToken: null,
//       status: "unauthenticated",
//     }),

//   clearSession: () =>
//     set({
//       user: null,
//       csrfToken: null,
//       status: "unauthenticated",
//     }),
// }));

// export const selectUser = (state: AuthState) => state.user;
// export const selectIsAuthenticated = (state: AuthState) =>
//   state.status === "authenticated";
