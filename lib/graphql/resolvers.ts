import { supabaseAdmin } from "@/lib/supabase/server";

export const resolvers = {
  Query: {
    users: async () => {
      const { data, error } = await supabaseAdmin.from("users").select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data ?? [];
    },
  },
  Mutation: {
    createUser: async (_: unknown, args: { name: string; email: string }) => {
      const { data, error } = await supabaseAdmin
        .from("users")
        .insert({ name: args.name, email: args.email })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  },
};
