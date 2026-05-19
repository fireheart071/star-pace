import { formidable } from 'formidable'
import fs from 'fs'
import { processAndUpload } from '../../lib/s3'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end('Method Not Allowed')
  }

  const form = formidable({})

  return new Promise((resolve) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: 'Parsing failed', detail: err.message })
        return resolve()
      }

      // Support multiple field names for images
      const file = files.image?.[0] || files.file?.[0] || Object.values(files)[0]?.[0]
      if (!file) {
        res.status(400).json({ error: 'No file detected in request.' })
        return resolve()
      }

      try {
        // Read file to buffer for processing
        const buffer = fs.readFileSync(file.filepath)
        
        // Use our custom S3 + Sharp workflow
        const url = await processAndUpload(buffer, file.originalFilename || 'upload.png')

        // Clean up temp file
        try { fs.unlinkSync(file.filepath) } catch (e) { /* ignore */ }

        res.status(200).json({ url })
        resolve()
      } catch (uploadError) {
        console.error('S3 Upload Error:', uploadError)
        res.status(500).json({ error: 'S3 storage failed', detail: uploadError.message })
        resolve()
      }
    })
  })
}
