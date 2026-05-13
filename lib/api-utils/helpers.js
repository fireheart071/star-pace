const PDFDocument = require('pdfkit')
const fs = require('fs-extra')
const path = require('path')
const cloudinary = require('../cloudinary')

async function saveBase64Image(dataUri) {
  if (!dataUri || typeof dataUri !== 'string' || !dataUri.startsWith('data:image/')) {
    return dataUri
  }
  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'ekgsite/uploads',
    })
    return result.secure_url
  } catch (error) {
    console.error('Cloudinary base64 upload failed:', error)
    return dataUri
  }
}

function normalizeResidence(input) {
  return {
    id: input.id,
    name: input.name,
    category: input.category || 'General',
    rate: input.rate || '',
    desc: input.desc || '',
    price: input.price || '',
    image: input.image || '',
    localImage: input.localImage || '',
    gallery: Array.isArray(input.gallery) ? input.gallery.filter(Boolean) : [],
    features: Array.isArray(input.features)
      ? input.features.filter(Boolean)
      : (typeof input.features === 'string' ? input.features.split(',').map(s => s.trim()).filter(Boolean) : []),
    specs: {
      bedrooms: Number(input.specs?.bedrooms) || 0,
      bathrooms: Number(input.specs?.bathrooms) || 0,
      guests: Number(input.specs?.guests) || 0,
      sqft: input.specs?.sqft || '',
      type: input.specs?.type || 'Apartment'
    }
  }
}

async function processImages(body) {
  if (!body) return body
  const nextBody = { ...body }
  if (nextBody.image) {
    nextBody.image = await saveBase64Image(nextBody.image)
  }
  if (Array.isArray(nextBody.gallery)) {
    const nextGallery = []
    for (const item of nextBody.gallery) {
      if (item) nextGallery.push(await saveBase64Image(item))
    }
    nextBody.gallery = nextGallery
  }
  return nextBody
}

function slugify(value) {
  return (value || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function normalizeModel(input) {
  return {
    id: input.id,
    name: input.name,
    category: input.category || 'General',
    rate: input.rate || '',
    desc: input.desc || '',
    price: input.price || '',
    range: input.range || '',
    rangeUnit: input.rangeUnit || 'km',
    topSpeed: input.topSpeed || '',
    topSpeedUnit: input.topSpeedUnit || 'km/h',
    zeroToSixty: input.zeroToSixty || '',
    zeroToSixtyUnit: input.zeroToSixtyUnit || 's',
    image: input.image || '',
    localImage: input.localImage || '',
    gallery: Array.isArray(input.gallery) ? input.gallery.filter(Boolean) : [],
    features: Array.isArray(input.features)
      ? input.features.filter(Boolean)
      : (typeof input.features === 'string' ? input.features.split(',').map(s => s.trim()).filter(Boolean) : []),
    specs: {
      battery: input.specs?.battery || '',
      drive: input.specs?.drive || '',
      seats: Number(input.specs?.seats) || 0,
      charging: input.specs?.charging || '',
      transmission: input.specs?.transmission || '',
      fuelType: input.specs?.fuelType || ''
    }
  }
}

// Lazy load storage to avoid circular dependencies
let storage;
function getStorage() {
  if (!storage) storage = require('../api-storage');
  return storage;
}

async function buildInvoiceBuffer(order) {
  let settings = {}
  try {
    settings = await getStorage().getSettings()
  } catch (err) {
    settings = {}
  }
  const supportPhone = settings.supportPhone || '+233 (0)501 326 989'
  const brandBlue = '#24276F'
  const brandGold = '#DF9738'

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'A4', 
        margin: 50,
        info: { Title: `Invoice - ${order.id}`, Author: 'Star Pace' }
      })
      const chunks = []
      doc.on('data', c => chunks.push(c))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      const logoPath = path.join(process.cwd(), 'public', 'favicon.png')
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 45, { width: 40 })
      }
      
      doc.fillColor(brandBlue).fontSize(20).text('STAR PACE', 100, 50)
      doc.fillColor('#666666').fontSize(9).text('PREMIUM MOBILITY & RESIDENCES', 100, 72, { characterSpacing: 1 })

      doc.fillColor(brandBlue).fontSize(14).text('CONFIRMATION', 350, 50, { align: 'right' })
      doc.fillColor('#999999').fontSize(9).text(`Reference: #${order.id}`, 350, 70, { align: 'right' })
      doc.text(`Issued: ${new Date().toLocaleDateString('en-GB')}`, 350, 82, { align: 'right' })

      doc.moveDown(4)
      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#eeeeee').lineWidth(1).stroke()
      doc.moveTo(50, doc.y).lineTo(150, doc.y).strokeColor(brandGold).lineWidth(2).stroke()
      doc.moveDown(2)

      const startY = doc.y
      doc.fillColor(brandBlue).fontSize(10).text('CLIENT INFORMATION', 50, startY)
      doc.moveDown(0.8)
      doc.fillColor('#333333').fontSize(11).text(order.name, { indent: 0 })
      doc.fillColor('#666666').fontSize(9).text(order.email || '-', { indent: 0 })
      doc.text(order.phone || '-', { indent: 0 })

      doc.fillColor(brandBlue).fontSize(10).text('RESERVATION DETAILS', 300, startY)
      doc.moveDown(0.8)
      doc.fillColor('#333333').fontSize(11).text(order.productName || 'Executive Asset', 300, doc.y)
      doc.fillColor('#666666').fontSize(9).text(`Location: ${order.location || 'Accra'}`, 300)
      doc.fillColor(brandGold).text(`${order.start}  -  ${order.end}`, 300)

      doc.moveDown(4)
      doc.fillColor(brandBlue).fontSize(10).text('FINANCIAL SUMMARY', 50, doc.y)
      doc.moveDown(1)
      const tableTop = doc.y
      doc.rect(50, tableTop, 495, 20).fill('#f8f9fa')
      doc.fillColor(brandBlue).fontSize(8).text('DESCRIPTION', 60, tableTop + 7)
      doc.text('RATE / PRICE', 450, tableTop + 7, { align: 'right', width: 85 })

      doc.fillColor('#333333').fontSize(10).text(`Service - ${order.productName}`, 60, tableTop + 30)
      doc.fillColor(brandBlue).fontSize(11).text(order.rate || order.price || 'Bespoke', 450, tableTop + 30, { align: 'right', width: 85 })
      doc.moveTo(50, tableTop + 50).lineTo(545, tableTop + 50).strokeColor('#eeeeee').lineWidth(1).stroke()
      
      doc.moveDown(3)
      if (order.note) {
        doc.fillColor('#666666').fontSize(8).text('SPECIAL REQUESTS:', 50, doc.y)
        doc.fillColor('#333333').fontSize(9).text(order.note, 50, doc.y + 12, { width: 300 })
        doc.moveDown(2)
      }

      const noteY = doc.y + 20
      doc.fillColor('#999999').fontSize(8).text('PAYMENT NOTICE:', 50, noteY)
      doc.fillColor('#666666').fontSize(8).text('Final payment is handled according to Star Pace policy. Please ensure a valid ID is present.', 50, noteY + 12, { width: 280, lineHeight: 1.4 })

      const sigY = noteY
      doc.moveTo(350, sigY + 40).lineTo(545, sigY + 40).strokeColor('#cccccc').lineWidth(0.5).stroke()
      doc.fillColor('#999999').fontSize(7).text('AUTHORIZED SIGNATURE / STAMP', 350, sigY + 45, { align: 'center', width: 195 })

      doc.rect(50, 680, 495, 50).fill('#fcfcf9')
      doc.fillColor(brandBlue).fontSize(8).text('24/7 EXECUTIVE SUPPORT', 60, 690)
      doc.fillColor('#666666').fontSize(8).text(`For immediate assistance, contact our support line at ${supportPhone}.`, 60, 702, { width: 475 })

      doc.fontSize(8).fillColor('#aaaaaa').text('Star Pace Ghana | Premium Mobility & Residences', 50, 780, { align: 'center', width: 495 })
      doc.end()
    } catch (e) { reject(e) }
  })
}

module.exports = { slugify, normalizeModel, normalizeResidence, buildInvoiceBuffer, processImages }
