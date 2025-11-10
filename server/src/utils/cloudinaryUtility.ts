import cloudinary from "../config/cloudinary";

type UploadType = "avatar" | "article" | "banner" | "general";

export const uploadToCloudinary = async (fileData: string, type: UploadType = "general") => {
    try {
        const folderMap: Record<UploadType, string> = {
            avatar: "lexica_avatars",
            article: "lexica_articles",
            banner: "lexica_banners",
            general: "lexica_uploads",
        };

        const uploadResult = await cloudinary.uploader.upload(fileData, {
            folder: folderMap[type],
            resource_type: "image",
        });

        return {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            format: uploadResult.format,
            bytes: uploadResult.bytes,
            folder: folderMap[type],
        };
        
    } catch (error: any) {
        console.error("Cloudinary upload error:", error.message);
        throw new Error("Failed to upload image to Cloudinary");
    }
};


export const deleteFromCloudinary = async (publicId: string) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
        
    } catch (error: any) {
        console.error("Cloudinary delete error:", error.message);
        throw new Error("Failed to delete image from Cloudinary");
    }
};
