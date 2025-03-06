import { readdirSync, readFileSync } from "fs"
import { join } from "path"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { s3Client } from "@/lib/s3"
import { MongoClient } from "mongodb"

async function migrateToS3() {
  // Connect to MongoDB
  const client = await MongoClient.connect(process.env.MONGODB_URI!)
  const db = client.db()

  // Your images collection/model
  const collection = db.collection("your_collection")

  // Local images directory
  const imagesDir = join(process.cwd(), "public", "images")

  try {
    const files = readdirSync(imagesDir)

    for (const file of files) {
      const filePath = join(imagesDir, file)
      const fileContent = readFileSync(filePath)

      // Upload to S3
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: file,
          Body: fileContent,
          ContentType: `image/${file.split(".").pop()}`,
        }),
      )

      // Generate new S3 URL
      const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file}`

      // Update MongoDB documents that reference this image
      await collection.updateMany({ imagePath: `/images/${file}` }, { $set: { imagePath: s3Url } })

      console.log(`Migrated ${file} to S3`)
    }

    console.log("Migration completed successfully")
  } catch (error) {
    console.error("Migration failed:", error)
  } finally {
    await client.close()
  }
}

