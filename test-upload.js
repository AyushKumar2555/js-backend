import dotenv from "dotenv";
import { uploadOnCloudinary } from "./src/utils/cloudinary.js";

// Load environment variables
dotenv.config({ path: "./.env" });

async function testUpload() {
    console.log("=== Testing Cloudinary Upload ===\n");
    
    // Check Cloudinary configuration
    console.log("Cloudinary Configuration:");
    console.log("- CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
    console.log("- CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
    console.log("- CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "***SET***" : "MISSING");
    
    console.log("\n=== Creating test image ===\n");
    
    // Create a simple test image
    const fs = await import('fs');
    const path = await import('path');
    
    const testDir = "public/temp";
    if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
        console.log("Created directory:", testDir);
    }
    
    const testFilePath = path.join(testDir, "test-image-" + Date.now() + ".png");
    
    // Create a simple 1x1 pixel PNG image
    const buffer = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
        0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00,
        0x00, 0x03, 0x00, 0x01, 0x00, 0x05, 0x57, 0x88, 0xB0, 0x7D, 0x00, 0x00,
        0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);
    
    fs.writeFileSync(testFilePath, buffer);
    console.log("✅ Created test image at:", testFilePath);
    console.log("File size:", fs.statSync(testFilePath).size, "bytes");
    
    console.log("\n=== Uploading to Cloudinary ===\n");
    
    try {
        const result = await uploadOnCloudinary(testFilePath);
        
        if (result) {
            console.log("✅ SUCCESS! File uploaded to Cloudinary");
            console.log("URL:", result.url);
            console.log("Public ID:", result.public_id);
            console.log("Format:", result.format);
            console.log("Size:", result.bytes, "bytes");
        } else {
            console.log("❌ FAILED! uploadOnCloudinary returned null");
            console.log("Possible issues:");
            console.log("1. Cloudinary credentials incorrect");
            console.log("2. Network connection issue");
            console.log("3. File too large or wrong format");
        }
    } catch (error) {
        console.log("❌ ERROR during upload:", error.message);
        console.log("Stack:", error.stack);
    }
    
    console.log("\n=== Test Complete ===\n");
}

// Run the test
testUpload().catch(console.error);