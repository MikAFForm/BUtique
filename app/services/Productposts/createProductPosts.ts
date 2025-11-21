import { mutate } from "@/lib/graphql/client";
import { CREATE_PRODUCT } from "@/lib/graphql/mutations";

export interface CreateProductPayload {
  sellerId: string;
  name: string;
  category: string;
  price: number;
  condition: string;
  status: string;
  description?: string;
  location?: string;
  file: File;
}

// Convert image file to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
  });
}

export async function createProductPost(data: CreateProductPayload) {
  try {
    const base64Image = await fileToBase64(data.file);

    const result = await mutate(CREATE_PRODUCT, {
      data: {
        sellerId: data.sellerId,
        name: data.name,
        price: data.price,
        condition: data.condition,
        status: data.status,
        category: data.category,
        description: data.description ?? null,
        location: data.location ?? null,
        imageUrls: [base64Image],
        hashtags: [],
      },
    });

    return result.createProduct;
  } catch (error: any) {
    console.error("Create product failed:", error);
    throw new Error(error?.message || "Failed to create product");
  }
}
