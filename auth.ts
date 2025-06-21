import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import { loginSchema } from './lib/zod';
import { compareSync } from 'bcrypt-ts';
import Google from 'next-auth/providers/google';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Refresh the token daily.
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
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
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        // If the user already exists and there's no linked Google account, link it.
        if (existingUser) {
          const existingGoogleAccount = await prisma.account.findFirst({
            where: {
              provider: 'google',
              providerAccountId: account.providerAccountId,
            },
          });

          if (!existingGoogleAccount) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                id_token: account.id_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
              },
            });
          }

          // ✅ Update the image if it doesn't exist yet.
          if (!existingUser.image && profile?.picture) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { image: profile.picture },
            });
          }
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.role = token.role;
      return session;
    },

    authorized({ auth, request: { nextUrl } }) {
      const user = auth?.user;
      const isLoggedIn = !!user;

      const roleRedaksi = ['ADMIN', 'PEMRED', 'REDAKTUR', 'REPORTER'];

      const protectedRoutes = [
        { prefix: '/dashboard', roles: roleRedaksi },
        { prefix: '/posts', roles: roleRedaksi },
        { prefix: '/asset', roles: roleRedaksi },
        { prefix: '/profile', roles: roleRedaksi },
      ];

      const blockedWhenLoggedIn = ['/auth'];

      // Verify if the route is protected and determine which role is required.
      const matchedRoute = protectedRoutes.find((route) =>
        nextUrl.pathname.startsWith(route.prefix),
      );

      const isBlockedRoute = blockedWhenLoggedIn.some((prefix) =>
        nextUrl.pathname.startsWith(prefix),
      );

      // 🔒 Not logged in, but the route is protected.
      if (!isLoggedIn && matchedRoute) {
        return Response.redirect(new URL('/auth/login', nextUrl));
      }

      // ✅ Logged in, but the role is not authorized.
      if (matchedRoute && isLoggedIn) {
        const allowedRoles = matchedRoute.roles;
        if (!allowedRoles.includes(user.role)) {
          return Response.redirect(new URL('/', nextUrl));
          // return new Response('Forbidden: Insufficient role', { status: 403 });
        }
      }

      // 🚫 Already logged in but redirected to /auth.
      if (isLoggedIn && isBlockedRoute) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },
  },
});
