require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const Paper = require('./models/Paper');
const Faculty = require('./models/Faculty');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is missing in .env file!');
  process.exit(1);
}

const seedDatabase = async () => {
  try {
    // 1. Check if data.json exists
    if (!fs.existsSync('./data.json')) {
      console.error('❌ data.json file not found! Please create it in the backend folder and paste your AI-generated JSON into it.');
      process.exit(1);
    }

    // 2. Read the JSON file
    console.log('📖 Reading data.json...');
    const rawData = fs.readFileSync('./data.json', 'utf8');
    const data = JSON.parse(rawData);

    if (!data.papers || !data.faculty) {
      console.error('❌ Invalid JSON format! It must have "papers" and "faculty" arrays.');
      process.exit(1);
    }

    // 3. Connect to MongoDB Atlas
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected successfully!');

    // 4. Clear existing data (optional, ensures a clean slate)
    console.log('🧹 Clearing old data...');
    await Paper.deleteMany({});
    await Faculty.deleteMany({});

    // 5. Transform 'id' to '_id' for MongoDB
    const papersWithId = data.papers.map(p => {
      const newP = { ...p, _id: p.id };
      delete newP.id;
      return newP;
    });

    const facultyWithId = data.faculty.map(f => {
      const newF = { ...f, _id: f.id };
      delete newF.id;
      return newF;
    });

    // 6. Insert new data
    console.log(`📥 Pushing ${papersWithId.length} papers to database...`);
    await Paper.insertMany(papersWithId);

    console.log(`📥 Pushing ${facultyWithId.length} faculty profiles to database...`);
    await Faculty.insertMany(facultyWithId);

    console.log('🎉 Data successfully seeded to MongoDB Atlas!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
