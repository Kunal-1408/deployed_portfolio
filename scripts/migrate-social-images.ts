import { PrismaClient } from "@prisma/client"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { readFile } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

// Initialize Prisma client
const prisma = new PrismaClient()

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

// Helper function to upload a file to S3
async function uploadToS3(filePath: string, contentType = "image/jpeg"): Promise<string> {
  try {
    // Check if the file exists
    const fullPath = join(process.cwd(), "public", filePath.replace(/^\//, ""))

    if (!existsSync(fullPath)) {
      console.warn(`File not found: ${fullPath}`)
      return filePath // Return original path if file not found
    }

    // Read the file
    const fileBuffer = await readFile(fullPath)

    // Generate a unique filename for S3
    const filename = `social/${Date.now()}-${filePath.split("/").pop()}`

    // Upload to S3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: filename,
        Body: fileBuffer,
        ContentType: contentType,
      }),
    )

    // Return the S3 URL
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`
  } catch (error) {
    console.error(`Error uploading file ${filePath} to S3:`, error)
    return filePath // Return original path on error
  }
}

// Function to determine content type based on file extension
function getContentType(filePath: string): string {
  const extension = filePath.split(".").pop()?.toLowerCase()

  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg"
    case "png":
      return "image/png"
    case "gif":
      return "image/gif"
    case "svg":
      return "image/svg+xml"
    case "webp":
      return "image/webp"
    default:
      return "application/octet-stream"
  }
}

// Main migration function
async function migrateSocialImages() {
  console.log("Starting migration of social images to S3...")

  try {
    // Get all social records
    const socialRecords = await prisma.social.findMany()
    console.log(`Found ${socialRecords.length} social records to process`)

    // Process each record
    for (const [index, record] of socialRecords.entries()) {
      console.log(`Processing record ${index + 1}/${socialRecords.length}: ${record.Brand}`)

      // Skip if no images to migrate
      if (!record.Logo && !record.banner) {
        console.log(`No images to migrate for record: ${record.id}`)
        continue
      }

      // Check if images are already S3 URLs
      const isLogoS3 = record.Logo?.startsWith("https://") && record.Logo?.includes("s3.")
      const isBannerS3 = record.banner?.startsWith("https://") && record.banner?.includes("s3.")

      // Only migrate if not already on S3
      let newLogoUrl = record.Logo
      let newBannerUrl = record.banner

      if (record.Logo && !isLogoS3) {
        console.log(`Migrating Logo: ${record.Logo}`)
        newLogoUrl = await uploadToS3(record.Logo, getContentType(record.Logo))
      }

      if (record.banner && !isBannerS3) {
        console.log(`Migrating Banner: ${record.banner}`)
        newBannerUrl = await uploadToS3(record.banner, getContentType(record.banner))
      }

      // Update the record in the database
      await prisma.social.update({
        where: { id: record.id },
        data: {
          Logo: newLogoUrl,
          banner: newBannerUrl,
        },
      })

      console.log(`Updated record ${record.id}`)
    }

    console.log("Migration completed successfully!")
  } catch (error) {
    console.error("Migration failed:", error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the migration
migrateSocialImages()
  .then(() => console.log("Migration script execution completed"))
  .catch((error) => console.error("Error in migration script:", error))

