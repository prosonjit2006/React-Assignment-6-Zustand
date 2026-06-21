import { loginFns, signupFns } from "@/api/functions/auth.function";
import { supabase } from "@/lib/supabsae.config";
import {
  AuthState,
  LoginPayload,
} from "@/types/interface/auth.interface";
import { deleteCookie } from "cookies-next";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { devtools } from "zustand/middleware";

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        isLoading: false,
        isAuthenticate: false,
        isError: null,
        role: null,
        user: null,

        // ! signup
        signupUser: async (payload) => {
          set({
            isLoading: true,
            isError: null,
          });

          try {
            const res = await signupFns(payload);

            if (!res.success) {
              set({
                isLoading: false,
                isError: res.message,
              });

              return res;
            }

            set({
              isLoading: false,
              isError: null,
            });

            return res;
          } catch (error) {
            const err = error as {
              message: string;
            };

            set({
              isLoading: false,
              isError: err.message,
            });

            return {
              success: false,
              message: err.message,
            };
          }
        },

        // ! Login
        loginUser: async (payload: LoginPayload) => {
          set({
            isLoading: true,
            isError: null,
          });

          try {
            const res = await loginFns(payload);

            if (!res.success) {
              set({
                isLoading: false,
                isError: res.message,
              });

              return res;
            }

            set({
              isLoading: false,
              isError: null,
              isAuthenticate: true,
              role: res.data.role,
              user: res.data,
            });

            return res;
          } catch (error) {
            const err = error as {
              message: string;
            };

            set({
              isLoading: false,
              isError: err.message,
            });

            return {
              success: false,
              message: err.message,
            };
          }
        },

        // ! logout
        logout: async () => {
          try {
            // Remove Supabase session
            await supabase.auth.signOut();

            // Remove custom cookies
            deleteCookie("token");
            deleteCookie("role");
            deleteCookie("user");

            set({
              isAuthenticate: false,
              role: null,
              user: null,
              isError: null,
            });

            return true;
          } catch (error) {
            console.error(error);
            return false;
          }
        },
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          isAuthenticate: state.isAuthenticate,
          role: state.role,
          user: state.user,
        }),
      },
    ),
  ),
);
