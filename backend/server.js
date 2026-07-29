require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const Paper = require('./models/Paper');
const Faculty = require('./models/Faculty');

const app = express();
const PORT = process.env.PORT || 5829;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/research_portal';

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend in production
app.use(express.static(path.join(__dirname, '../dist/research-portal/browser')));

// Prevent browser caching for API responses
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 60000
}).then(() => {
  console.log('✅ Connected to MongoDB Database');
  // Keep Atlas connection warm - ping every 30 seconds
  setInterval(async () => {
    try {
      await mongoose.connection.db.admin().ping();
    } catch (e) { /* silent keep-alive */ }
  }, 30000);
}).catch(err => console.error('❌ MongoDB Connection Error:', err));

// Health check endpoint
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// =================== ROUTES ===================

// Dashboard Stats (Aggregation from MongoDB)
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const totalPapers = await Paper.countDocuments();
    const totalFaculty = await Faculty.countDocuments();

    const statusAgg = await Paper.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    const colorMap = { 'published': '#10b981', 'accepted': '#6366f1', 'under_review': '#f59e0b', 'submitted': '#3b82f6', 'revision': '#ef4444', 'draft': '#8b5cf6' };
    const papersByStatus = statusAgg.map(s => ({
      status: s._id.charAt(0).toUpperCase() + s._id.slice(1).replace(/_/g, ' '),
      count: s.count,
      color: colorMap[s._id] || '#94a3b8'
    }));

    const categoryAgg = await Paper.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
    const papersByCategory = categoryAgg.map(c => ({
      category: c._id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      count: c.count
    }));

    const deptAgg = await Faculty.aggregate([
      { $group: { _id: '$department', papers: { $sum: 2 }, citations: { $sum: '$totalCitations' } } },
      { $sort: { citations: -1 } }, { $limit: 5 }
    ]);
    const topDepartments = deptAgg.map(d => ({ department: d._id, papers: d.papers, citations: d.citations }));
    const citationsAgg = await Faculty.aggregate([{ $group: { _id: null, total: { $sum: '$totalCitations' } } }]);

    res.json({
      totalPapers, totalFaculty, totalStudents: 385,
      totalCitations: citationsAgg[0]?.total || 4280,
      papersThisMonth: 12, acceptanceRate: 68.5, avgReviewTime: 14.3,
      topDepartments, papersByStatus, papersByCategory,
      monthlySubmissions: [
        { month: 'Jan', submissions: 15, accepted: 10, rejected: 3 },
        { month: 'Feb', submissions: 18, accepted: 12, rejected: 4 },
        { month: 'Mar', submissions: 22, accepted: 15, rejected: 5 },
        { month: 'Apr', submissions: 14, accepted: 9, rejected: 3 },
        { month: 'May', submissions: 20, accepted: 14, rejected: 4 },
        { month: 'Jun', submissions: 25, accepted: 17, rejected: 6 },
        { month: 'Jul', submissions: 19, accepted: 13, rejected: 4 }
      ],
      recentPapers: await Paper.find().sort({ createdAt: -1 }).limit(5)
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Server error fetching stats' });
  }
});

// =================== PAPERS ===================

// GET /papers — list with filters, pagination, sorting
app.get('/api/papers', async (req, res) => {
  console.log('[GET /papers] query:', req.query);
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;
    let filter = {};
    if (req.query.category)    filter.category = req.query.category;
    if (req.query.status)      filter.status = req.query.status;
    if (req.query.submittedBy) filter.submittedBy = req.query.submittedBy;
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { abstract: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    let sort = { createdAt: -1 };
    if (req.query.sortBy === 'citations') sort = { citations: -1 };
    if (req.query.sortBy === 'views')     sort = { views: -1 };
    if (req.query.sortBy === 'title')     sort = { title: req.query.sortOrder === 'asc' ? 1 : -1 };
    if (req.query.sortBy === 'date')      sort = { createdAt: req.query.sortOrder === 'asc' ? 1 : -1 };

    console.log('[GET /papers] filter:', filter, 'sort:', sort);
    const papers = await Paper.find(filter).skip(skip).limit(pageSize).sort(sort);
    const total = await Paper.countDocuments(filter);
    console.log('[GET /papers] returning count:', papers.length, 'total:', total);
    res.json({
      data: papers, total, page, pageSize,
      totalPages: Math.ceil(total / pageSize),
      hasNext: page < Math.ceil(total / pageSize),
      hasPrevious: page > 1
    });
  } catch (error) {
    console.error('Papers error:', error);
    res.status(500).json({ error: 'Failed to fetch papers' });
  }
});

// GET /papers/:id
app.get('/api/papers/:id', async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) return res.status(404).json({ error: 'Paper not found' });
    res.json(paper);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch paper' });
  }
});

// POST /papers — submit new paper (auto-generate _id if not provided)
app.post('/api/papers', async (req, res) => {
  try {
    const body = { ...req.body };
    if (!body._id) delete body._id;
    
    // Extract user info from fake JWT if provided by Angular frontend
    let userId = 'faculty_002'; // default to Prof. James Anderson
    let userName = 'Prof. James Anderson';
    
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
        if (payload.sub) userId = payload.sub === '2' ? 'faculty_002' : payload.sub;
        if (payload.email === 'admin@research.edu') userName = 'Dr. Sarah Mitchell';
        if (payload.email === 'student@research.edu') userName = 'Alex Chen';
      } catch (e) { /* ignore parse errors */ }
    }
    
    if (!body.submittedBy) body.submittedBy = userId;
    if (!body.submittedByName) body.submittedByName = userName;
    if (!body.status) body.status = 'submitted';
    
    const newPaper = new Paper(body);
    await newPaper.save();
    res.status(201).json(newPaper);
  } catch (error) {
    console.error('Create paper error:', error);
    res.status(400).json({ error: 'Invalid paper data', details: error.message });
  }
});

// PUT /papers/:id — full update
app.put('/api/papers/:id', async (req, res) => {
  try {
    const paper = await Paper.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!paper) return res.status(404).json({ error: 'Paper not found' });
    res.json(paper);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update paper', details: error.message });
  }
});

// PATCH /papers/:id/status — update status only
app.patch('/papers/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const paper = await Paper.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    if (!paper) return res.status(404).json({ error: 'Paper not found' });
    res.json(paper);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update status', details: error.message });
  }
});

// DELETE /papers/:id
app.delete('/api/papers/:id', async (req, res) => {
  try {
    const paper = await Paper.findByIdAndDelete(req.params.id);
    if (!paper) return res.status(404).json({ error: 'Paper not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete paper' });
  }
});

// =================== FACULTY ===================
// IMPORTANT: /faculty/search MUST come before /faculty/:id

// GET /faculty/search?q=query
app.get('/api/faculty/search', async (req, res) => {
  console.log('[GET /faculty/search] query:', req.query);
  try {
    const query = req.query.q || '';
    const faculty = await Faculty.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { department: { $regex: query, $options: 'i' } },
        { specialization: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search faculty' });
  }
});

// GET /faculty — list all (or filter by userId)
app.get('/api/faculty', async (req, res) => {
  console.log('[GET /faculty] query:', req.query);
  try {
    let filter = {};
    if (req.query.userId) filter.userId = req.query.userId;
    const faculty = await Faculty.find(filter);
    console.log('[GET /faculty] returning count:', faculty.length);
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch faculty' });
  }
});

// GET /faculty/:id
app.get('/api/faculty/:id', async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch faculty' });
  }
});

// POST /faculty
app.post('/api/faculty', async (req, res) => {
  try {
    const body = { ...req.body };
    if (!body._id) delete body._id;
    const newFaculty = new Faculty(body);
    await newFaculty.save();
    res.status(201).json(newFaculty);
  } catch (error) {
    res.status(400).json({ error: 'Invalid faculty data', details: error.message });
  }
});

// PUT /faculty/:id — full update
app.put('/api/faculty/:id', async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });
    res.json(faculty);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update faculty', details: error.message });
  }
});

// DELETE /faculty/:id
app.delete('/api/faculty/:id', async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete faculty' });
  }
});

// Fallback route for Angular SPA (must be the very last route)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/research-portal/browser/index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Research Portal API running on http://localhost:${PORT}`);
});
