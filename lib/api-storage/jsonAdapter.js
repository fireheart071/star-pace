const path = require('path')
const fs = require('fs-extra')
console.log('--- JSON ADAPTER MODULE LOADING ---')

const DATA_DIR = path.join(process.cwd(), 'data')
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json')
const VEHICLES_FILE = path.join(DATA_DIR, 'vehicles.json')
const TESTIMONIALS_FILE = path.join(DATA_DIR, 'testimonials.json')
const NEWS_FILE = path.join(DATA_DIR, 'news.json')
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json')
const COMMENTS_FILE = path.join(DATA_DIR, 'comments.json')
const TEAM_FILE = path.join(DATA_DIR, 'team.json')
const GALLERY_FILE = path.join(DATA_DIR, 'gallery.json')

fs.ensureDirSync(DATA_DIR)

function readJson(file, defaultVal = []) {
  try { return fs.readJsonSync(file) } catch (e) { return defaultVal }
}

function writeJson(file, data) { fs.writeJsonSync(file, data, { spaces: 2 }) }

module.exports = {
  getOrders: () => readJson(ORDERS_FILE),
  saveOrders: (orders) => writeJson(ORDERS_FILE, orders),
  deleteOrder: (id) => {
    const items = readJson(ORDERS_FILE).filter(o => o.id !== id)
    writeJson(ORDERS_FILE, items)
  },
  // Rebranded Methods
  getVehicles: () => readJson(VEHICLES_FILE),
  saveVehicles: (vehicles) => writeJson(VEHICLES_FILE, vehicles),
  deleteVehicle: (id) => {
    const items = readJson(VEHICLES_FILE).filter(m => m.id !== id)
    writeJson(VEHICLES_FILE, items)
  },
  // Backward compatibility aliases
  getModels: () => readJson(VEHICLES_FILE),
  saveModels: (models) => writeJson(VEHICLES_FILE, models),
  deleteModel: (id) => {
    const items = readJson(VEHICLES_FILE).filter(m => m.id !== id)
    writeJson(VEHICLES_FILE, items)
  },
  
  getTestimonials: () => readJson(TESTIMONIALS_FILE),
  saveTestimonials: (items) => writeJson(TESTIMONIALS_FILE, items),
  deleteTestimonial: (id) => {
    const items = readJson(TESTIMONIALS_FILE).filter(t => t.id !== id)
    writeJson(TESTIMONIALS_FILE, items)
  },
  getNews: () => readJson(NEWS_FILE),
  saveNews: (items) => writeJson(NEWS_FILE, items),
  deleteNews: (id) => {
    const items = readJson(NEWS_FILE).filter(n => n.id !== id)
    writeJson(NEWS_FILE, items)
  },
  // Comments System
  getComments: () => readJson(COMMENTS_FILE),
  saveComments: (data) => writeJson(COMMENTS_FILE, data),

  getTeam: () => readJson(TEAM_FILE),
  saveTeam: (data) => writeJson(TEAM_FILE, data),
  deleteTeamMember: (id) => {
    const items = readJson(TEAM_FILE).filter(m => m.id !== id)
    writeJson(TEAM_FILE, items)
  },
  deleteComment: (id) => {
    const items = readJson(COMMENTS_FILE).filter(c => c.id !== id)
    writeJson(COMMENTS_FILE, items)
  },
  
  getSettings: () => readJson(SETTINGS_FILE, {}),
  saveSettings: (settings) => writeJson(SETTINGS_FILE, settings),

  getGallery: () => readJson(GALLERY_FILE),
  saveGallery: (items) => writeJson(GALLERY_FILE, items),
  deleteGalleryItem: (id) => {
    const items = readJson(GALLERY_FILE).filter(g => g.id !== id)
    writeJson(GALLERY_FILE, items)
  }
}
