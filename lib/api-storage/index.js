// Storage adapter selector. Exposes a common API for server data operations.
const adapterName = process.env.STORAGE_ADAPTER || 'json'

let storage
if (adapterName === 'postgres' || adapterName === 'postgress') {
  console.log('--- STORAGE ADAPTER: POSTGRES ACTIVE ---')
  storage = require('./postgresAdapter')
} else {
  console.log('--- STORAGE ADAPTER: JSON ACTIVE ---')
  storage = require('./jsonAdapter')
}

// Explicit verification of required methods
const requiredMethods = ['getResidences', 'saveResidences', 'deleteResidence', 'getVehicles', 'getOrders', 'getReviews'];
requiredMethods.forEach(method => {
  if (typeof storage[method] !== 'function') {
    console.error(`CRITICAL: Storage method ${method} is MISSING from ${adapterName} adapter!`);
  }
});

module.exports = storage
