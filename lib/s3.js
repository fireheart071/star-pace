import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import sharp from "sharp"

export const s3Client = new S3Client({
  region: process.env.S3_REGION || 'us-east-1',
  endpoint: process.env.S3_ENDPOINT, // Custom endpoint support
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true', // Needed for some S3-compatible providers
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  },
})

/**
 * Processes a buffer with Sharp and uploads it to S3.
 * Returns the proxy URL for the public frontend.
 */
export async function processAndUpload(buffer, originalFilename) {
  if (!buffer) throw new Error("No buffer provided to processAndUpload")

  const filename = `${Date.now()}-${originalFilename.replace(/\s+/g, "-")}.webp`
  const key = `uploads/${filename}`

  // 1. Optimize with Sharp (Tres Jolie logic)
  const optimizedBuffer = await sharp(buffer)
    .resize(1200, null, { withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer()

  // 2. Upload to S3
  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: optimizedBuffer,
    ContentType: "image/webp",
  }))

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
  return `${baseUrl}/api/images/${key}`
}

/**
 * Deletes an object from S3 based on its key.
 */
export async function deleteFile(key) {
  const { DeleteObjectCommand } = require("@aws-sdk/client-s3")
  try {
    await s3Client.send(new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
    }))
    return true
  } catch (err) {
    console.error("S3 Delete Error:", err)
    return false
  }
}
