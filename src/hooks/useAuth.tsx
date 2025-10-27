import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export type UserRole = "admin" | "business" | "candidate";

interface AuthState {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    role: null,
    loading: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Fetch user role
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .single();

          setAuthState({
            user: session.user,
            role: roleData?.role || "candidate",
            loading: false,
          });
        } else {
          setAuthState({
            user: null,
            role: null,
            loading: false,
          });
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single();

        setAuthState({
          user: session.user,
          role: roleData?.role || "candidate",
          loading: false,
        });
      } else {
        setAuthState({
          user: null,
          role: null,
          loading: false,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return { ...authState, signOut };
};
