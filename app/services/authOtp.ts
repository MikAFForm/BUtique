import { AUTH_OTP } from "@/lib/graphql/mutations";
import { mutate } from "@/lib/graphql/client";

type AuthOtpResponse = {
  authOtp: boolean;
};

export async function authOtp(email: string, otp: number): Promise<boolean> {
  const result = await mutate<AuthOtpResponse>(AUTH_OTP, { email, otp });
  return result?.authOtp ?? false;
}
