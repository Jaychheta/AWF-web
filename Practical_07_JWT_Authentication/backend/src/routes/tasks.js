const router = require('express').Router();
const { createTask, listTasks } = require('../controllers/taskController');
const { validateTask } = require('../middleware/validate');
const { protect } = require('../middleware/auth');

router.use(protect); // every task route requires a valid JWT
router.post('/', validateTask, createTask);
router.get('/', listTasks);

module.exports = router;
