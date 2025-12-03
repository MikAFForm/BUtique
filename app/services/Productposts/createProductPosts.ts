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
  files: File[];
  hashtags: string[];
}

// Convert File
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject("Failed to convert file to base64");

    reader.readAsDataURL(file);
  });
}

// Convert multiple files 
async function convertFilesToBase64(files: File[]): Promise<string[]> {
  return Promise.all(
    files.map((file, index) => {
      if (!(file instanceof File)) {
        console.error(`❌ File at index ${index} is NOT a File:`, file);
        throw new Error(
          `Invalid file at index ${index}. Expected a File object.`
        );
      }
      return fileToBase64(file);
    })
  );
}

export async function createProductPost(payload: CreateProductPayload) {
  try {
    // Convert multiple images into base64 strings
    const base64Images = await convertFilesToBase64(payload.files);

    const result = await mutate(CREATE_PRODUCT, {
      data: {
        sellerId: payload.sellerId,
        name: payload.name,
        price: payload.price,
        condition: payload.condition,
        status: payload.status,
        category: payload.category,
        description: payload.description ?? null,
        location: payload.location ?? null,
        imageUrls: base64Images,
        hashtags: payload.hashtags,
      },
    });

    return result.createProduct;
  } catch (error: any) {
    console.error("❌ Create product failed:", error);
    throw new Error(error?.message || "Failed to create product");
  }
}
