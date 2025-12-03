import { mutate } from "@/lib/graphql/client";
import { TOGGLE_INTEREST } from "@/lib/graphql/mutations";

export interface ToggleInterestResponse {
  message: string;
  liked: boolean | null;
}

export async function toggleInterest(
  userId: string,
  productId: string
): Promise<ToggleInterestResponse> {
  const result = await mutate(TOGGLE_INTEREST, { userId, productId });

  return {
    message: result.toggleInterest.message,
    liked: result.toggleInterest.liked,
  };
}
