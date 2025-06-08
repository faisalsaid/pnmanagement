import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import { loginSchema } from './lib/zod';
import { compareSync } from 'bcrypt-ts';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      credentials: {},

      authorize: async (credentials) => {
        console.log('authCredentials ==>>', credentials);

        // validate crendetials input
        const validatedFields = loginSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        // desctruction credentials
        const { email, password } = validatedFields.data;

        // check user exist and have password
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.hashPassword) {
          throw new Error('No user found');
        }

        // compare hashed password
        const passwordMatch = compareSync(password, user.hashPassword);

        if (!passwordMatch) {
          return null;
        }

        // remove hashPassord before send
        const { hashPassword, ...cleanUser } = user;
        console.log('authCredentials ==>>', cleanUser);

        return cleanUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.role = token.role;
      return session;
    },
  },
});
