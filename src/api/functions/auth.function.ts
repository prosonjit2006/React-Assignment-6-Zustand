import { supabase } from "@/lib/supabsae.config";
import { LoginPayload, SignupPayload } from "@/types/interface/auth.interface";
import { setCookie } from "cookies-next";

// ! signupFns
export const signupFns = async (payload: SignupPayload) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
    });

    if (authError) throw authError;

    if (!authData.user) {
      throw new Error("Failed to create user");
    }

    const { data, error } = await supabase
      .from("users")
      .insert({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        role: payload.role ?? "USER",
        auth_user_id: authData.user.id,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      message: "Account created successfully",
      data,
    };
  } catch (error) {
    const err = error as {
      message: string;
    };

    return {
      success: false,
      message: err.message ?? "Signup failed",
      data: null,
    };
  }
};

// ! loginFns
export const loginFns = async (payload: LoginPayload) => {
  try {
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });

    if (authError) throw authError;

    if (!authData.user) {
      throw new Error("Login Failed");
    }

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("auth_user_id", authData.user.id)
      .single();

    if (profileError) throw profileError;

    setCookie("token", authData.session?.access_token ?? "", {
      maxAge: 60 * 60 * 24 * 7,
    });

    setCookie("role", profile.role, {
      maxAge: 60 * 60 * 24 * 7,
    });

    setCookie("user", JSON.stringify(profile), {
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      success: true,
      message: "Login Successfully",
      data: profile,
    };
  } catch (error) {
    const err = error as {
      message: string;
    };

    return {
      success: false,
      message: err.message,
      data: null,
    };
  }
};
