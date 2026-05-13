import { s3Client } from "../../../lib/s3"
import { GetObjectCommand } from "@aws-sdk/client-s3"

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { path } = req.query
  if (!path || !Array.isArray(path)) {
    return res.status(400).json({ message: 'Invalid path' })
  }

  const key = path.join('/')

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
    })

    const response = await s3Client.send(command)

    // Set headers for caching and content type
    res.setHeader('Content-Type', response.ContentType || 'image/webp')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')

    // Stream the body to the response
    const stream = response.Body
    if (stream.pipe) {
      return stream.pipe(res)
    } else {
      // Handle cases where Body might not be a standard Node stream (e.g. Uint8Array)
      const buffer = Buffer.from(await response.Body.transformToByteArray())
      return res.send(buffer)
    }
  } catch (error) {
    console.error(`S3 Proxy Error for key: ${key}`, error)
    return res.status(404).send('Image not found')
  }
}
