// app/auth.ts
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    // Credentials (email/password)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // TEMP: replace with DB later
        const user = {
          id: "1",
          email: "admin@test.com",
          password: await bcrypt.hash("123456", 10),
        };

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid || credentials.email !== user.email) return null;

        return { id: user.id, email: user.email };
      },
    }),

    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

//   session: {
//     strategy: "jwt",
//   },

  secret: process.env.NEXTAUTH_SECRET,
};
