// IndexedDB wrapper for secure storage
const DB_NAME = 'medicIncidentFormDB';
const DB_VERSION = 1;

const STORES = {
  INCIDENTS: 'incidents',
  PATIENTS: 'patients',
  SETTINGS: 'settings',
  IMAGES: 'images' // For patient images
};

let dbInstance = null;

const openDB = () => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(STORES.INCIDENTS)) {
        const incidentsStore = db.createObjectStore(STORES.INCIDENTS, { keyPath: 'id' });
        incidentsStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.PATIENTS)) {
        const patientsStore = db.createObjectStore(STORES.PATIENTS, { keyPath: 'id' });
        patientsStore.createIndex('name', 'name', { unique: false });
        patientsStore.createIndex('maNumber', 'maNumber', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
      }

      if (!db.objectStoreNames.contains(STORES.IMAGES)) {
        db.createObjectStore(STORES.IMAGES, { keyPath: 'id' });
      }
    };
  });
};

const getStore = (storeName, mode = 'readonly') => {
  return openDB().then((db) => {
    const transaction = db.transaction([storeName], mode);
    return transaction.objectStore(storeName);
  });
};

// Generic CRUD operations
const dbGet = async (storeName, key) => {
  try {
    const store = await getStore(storeName, 'readonly');
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error(`Error getting ${key} from ${storeName}:`, error);
    return null;
  }
};

const dbGetAll = async (storeName) => {
  try {
    const store = await getStore(storeName, 'readonly');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error(`Error getting all from ${storeName}:`, error);
    return [];
  }
};

const dbPut = async (storeName, data) => {
  try {
    const store = await getStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error(`Error putting data to ${storeName}:`, error);
    throw error;
  }
};

const dbDelete = async (storeName, key) => {
  try {
    const store = await getStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error(`Error deleting ${key} from ${storeName}:`, error);
    throw error;
  }
};

const dbClear = async (storeName) => {
  try {
    const store = await getStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error(`Error clearing ${storeName}:`, error);
    throw error;
  }
};

// Image storage helpers
const saveImage = async (imageId, blob) => {
  try {
    const imageData = {
      id: imageId,
      blob: blob,
      timestamp: new Date().toISOString()
    };
    await dbPut(STORES.IMAGES, imageData);
    return imageId;
  } catch (error) {
    console.error('Error saving image:', error);
    throw error;
  }
};

const getImage = async (imageId) => {
  try {
    const imageData = await dbGet(STORES.IMAGES, imageId);
    return imageData ? imageData.blob : null;
  } catch (error) {
    console.error('Error getting image:', error);
    return null;
  }
};

const deleteImage = async (imageId) => {
  try {
    await dbDelete(STORES.IMAGES, imageId);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

const getImageUrl = async (imageId) => {
  if (!imageId) return null;
  try {
    const blob = await getImage(imageId);
    if (blob) {
      return URL.createObjectURL(blob);
    }
    return null;
  } catch (error) {
    console.error('Error getting image URL:', error);
    return null;
  }
};

// Migration from localStorage
const migrateFromLocalStorage = async () => {
  try {
    // Check if migration is needed
    const migrationKey = 'migration_completed';
    const migrationStatus = await dbGet(STORES.SETTINGS, migrationKey);
    if (migrationStatus) {
      return; // Already migrated
    }

    // Migrate incidents
    try {
      const incidentsJson = localStorage.getItem('incidentFormRecords');
      if (incidentsJson) {
        const incidents = JSON.parse(incidentsJson);
        if (Array.isArray(incidents) && incidents.length > 0) {
          const store = await getStore(STORES.INCIDENTS, 'readwrite');
          for (const incident of incidents) {
            await new Promise((resolve, reject) => {
              const request = store.put(incident);
              request.onsuccess = () => resolve();
              request.onerror = () => reject(request.error);
            });
          }
          console.log(`Migrated ${incidents.length} incidents from localStorage`);
        }
      }
    } catch (error) {
      console.error('Error migrating incidents:', error);
    }

    // Migrate patients
    try {
      const patientsJson = localStorage.getItem('incidentFormPatients');
      if (patientsJson) {
        const patients = JSON.parse(patientsJson);
        if (Array.isArray(patients) && patients.length > 0) {
          const store = await getStore(STORES.PATIENTS, 'readwrite');
          for (const patient of patients) {
            await new Promise((resolve, reject) => {
              const request = store.put(patient);
              request.onsuccess = () => resolve();
              request.onerror = () => reject(request.error);
            });
          }
          console.log(`Migrated ${patients.length} patients from localStorage`);
        }
      }
    } catch (error) {
      console.error('Error migrating patients:', error);
    }

    // Migrate settings
    try {
      const settingsJson = localStorage.getItem('incidentFormSettings');
      if (settingsJson) {
        const settings = JSON.parse(settingsJson);
        await dbPut(STORES.SETTINGS, {
          key: 'settings',
          value: settings
        });
        console.log('Migrated settings from localStorage');
      }
    } catch (error) {
      console.error('Error migrating settings:', error);
    }

    // Mark migration as complete
    await dbPut(STORES.SETTINGS, {
      key: migrationKey,
      value: true
    });

    console.log('Migration from localStorage completed');
  } catch (error) {
    console.error('Error during migration:', error);
  }
};

// Export API
window.DB = {
  STORES,
  openDB,
  get: dbGet,
  getAll: dbGetAll,
  put: dbPut,
  delete: dbDelete,
  clear: dbClear,
  saveImage,
  getImage,
  deleteImage,
  getImageUrl,
  migrateFromLocalStorage
};

