import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = new MongoClient(process.env.MONGODB_URI);

        try {
          await client.connect();
          const db = client.db("ukm");
          const users = db.collection("users");

          const user = await users.findOne({
            username: { $regex: `^${credentials.username}$`, $options: "i" },
          });

          if (!user || !user.password) return null;

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) return null;

          return {
            id: user._id.toString(),
            name: user.nama,
            username: user.username,
            role: user.role,
            avatar: user.avatar || null,
            status: user.status || "Aktif",
          };
        } catch (error) {
          console.error("❌ Error in authorize:", error.message);
          return null;
        } finally {
          await client.close();
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.username = user.username;
        token.role = user.role;
        token.avatar = user.avatar;
        token.status = user.status;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.nama = token.name;
      session.user.username = token.username;
      session.user.role = token.role;
      session.user.avatar = token.avatar;
      session.user.status = token.status;
      return session;
    },
  },
};
