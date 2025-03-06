const { PrismaClient } = require("@prisma/client")
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3")
const fs = require("fs")
const path = require("path")
const { promisify } = require("util")

const readFile = promisify(fs.readFile)
const existsSync = fs.existsSync

// Initialize Prisma client
const prisma = new PrismaClient()

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

// Helper function to upload a file to S3
async function uploadToS3(filePath, contentType = "image/jpeg") {
  try {
    // Check if the file exists
    const fullPath = path.join(process.cwd(), "public", filePath.replace(/^\//, ""))

    if (!existsSync(fullPath)) {
      console.warn(`File not found: ${fullPath}`)
      return filePath // Return original path if file not found
    }

    // Read the file
    const fileBuffer = await readFile(fullPath)

    // Generate a unique filename for S3
    const filename = `websites/${Date.now()}-${filePath.split("/").pop()}`

    // Upload to S3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
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
function getContentType(filePath) {
  if (!filePath) return "application/octet-stream"

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
async function migrateWebsitesImages() {
  console.log("Starting migration of websites images to S3...")

  try {
    // Get all websites records
    const websitesRecords = await prisma.websites.findMany()
    console.log(`Found ${websitesRecords.length} websites records to process`)

    // Process each record
    for (const [index, record] of websitesRecords.entries()) {
      console.log(`Processing record ${index + 1}/${websitesRecords.length}: ${record.Title}`)

      // Skip if no images to migrate
      if (!record.Images && !record.Logo) {
        console.log(`No images to migrate for record: ${record.id}`)
        continue
      }

      // Check if images are already S3 URLs
      const isImagesS3 = record.Images?.startsWith("https://") && record.Images?.includes("s3.")
      const isLogoS3 = record.Logo?.startsWith("https://") && record.Logo?.includes("s3.")

      // Only migrate if not already on S3
      let newImagesUrl = record.Images
      let newLogoUrl = record.Logo

      if (record.Images && !isImagesS3) {
        console.log(`Migrating Images: ${record.Images}`)
        newImagesUrl = await uploadToS3(record.Images, getContentType(record.Images))
      }

      if (record.Logo && !isLogoS3) {
        console.log(`Migrating Logo: ${record.Logo}`)
        newLogoUrl = await uploadToS3(record.Logo, getContentType(record.Logo))
      }

      // Update the record in the database
      await prisma.websites.update({
        where: { id: record.id },
        data: {
          Images: newImagesUrl,
          Logo: newLogoUrl,
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
migrateWebsitesImages()
  .then(() => console.log("Migration script execution completed"))
  .catch((error) => console.error("Error in migration script:", error))

