import { authOptions } from "@/src/utils/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, handler as DELETE, handler as PUT };