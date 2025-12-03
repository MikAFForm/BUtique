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
  const response = {
    message: result.toggleInterest.message as string,
    liked: result.toggleInterest.liked as boolean | null,
  };

  if (response.message === "cannot_toggle_own_product") {
    throw new Error("You cannot toggle interest on your own product.");
  }

  return response;
}
