/**
 * NextAuth Configuration
 * This is a standalone configuration file for NextAuth options.
 */

export const authOptions = {
  // Add your NextAuth configuration here
  providers: [
    // Add your authentication providers
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken;
      return session;
    },
  },
  // Add other NextAuth options as needed
};
