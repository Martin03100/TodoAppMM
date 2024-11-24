const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/shoppinglistapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

const shoppingListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ itemName: String, status: String }],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const ShoppingList = mongoose.model('ShoppingList', shoppingListSchema);

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  console.log('Register endpoint hit with data:', req.body);
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    console.log('New user created:', newUser);
    res.json(newUser);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login endpoint hit with data:', req.body);
  try {
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      console.log('User authenticated:', user);
      res.json({ username: user.username });
    } else {
      console.error('Invalid credentials for user:', username);
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Error logging in user' });
  }
});

app.post('/api/createShoppingList', async (req, res) => {
  const { name, owner } = req.body;
  console.log('Create shopping list request received:', req.body);
  try {
    const user = await User.findOne({ username: owner });
    if (!user) {
      console.error('User not found:', owner);
      return res.status(400).json({ error: 'User not found' });
    }
    const newList = new ShoppingList({ name, owner: user._id, items: [], members: [user._id] });
    await newList.save();
    console.log('New shopping list created:', newList);
    res.json(newList);
  } catch (error) {
    console.error('Error creating shopping list:', error);
    res.status(500).json({ error: 'Error creating shopping list' });
  }
});

app.get('/api/getShoppingLists', async (req, res) => {
  const { username } = req.query;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    const lists = await ShoppingList.find({ $or: [{ owner: user._id }, { members: user._id }] });
    res.json(lists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching shopping lists' });
  }
});

app.post('/api/addItem', async (req, res) => {
  const { listId, itemName } = req.body;
  try {
    const list = await ShoppingList.findById(listId);
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }
    list.items.push({ itemName, status: 'pending' });
    await list.save();
    res.json(list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding item' });
  }
});

app.post('/api/markItemAsResolved', async (req, res) => {
  const { listId, itemId } = req.body;
  try {
    const list = await ShoppingList.findById(listId);
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }
    const item = list.items.id(itemId);
    if (item) {
      item.status = 'resolved';
      await list.save();
      res.json(list);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    console.error('Error marking item as resolved:', error);
    res.status(500).json({ error: 'Error marking item as resolved' });
  }
});

app.post('/api/inviteMember', async (req, res) => {
  const { listId, username, owner } = req.body;
  console.log('Invite request:', { listId, username, owner });
  try {
    const list = await ShoppingList.findById(listId);
    if (!list) {
      console.log('List not found');
      return res.status(404).json({ error: 'List not found' });
    }
    const ownerUser = await User.findOne({ username: owner });
    if (!ownerUser || !list.owner.equals(ownerUser._id)) {
      console.log('No permission to invite members');
      return res.status(403).json({ error: 'You do not have permission to invite members to this list' });
    }
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }
    if (!list.members.includes(user._id)) {
      list.members.push(user._id);
      await list.save();
    }
    res.json(list);
  } catch (error) {
    console.error('Error inviting member:', error);
    res.status(500).json({ error: 'Error inviting member' });
  }
});

app.delete('/api/deleteShoppingList', async (req, res) => {
  const { listId, username } = req.body;
  try {
    const list = await ShoppingList.findById(listId);
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }
    const user = await User.findOne({ username });
    if (!user || !list.owner.equals(user._id)) {
      return res.status(403).json({ error: 'You do not have permission to delete this list' });
    }
    await ShoppingList.findByIdAndDelete(listId);
    res.json({ status: 'success', message: 'List deleted' });
  } catch (error) {
    console.error('Error deleting shopping list:', error);
    res.status(500).json({ error: 'Error deleting shopping list' });
  }
});

app.post('/api/getMembers', async (req, res) => {
  const { listId } = req.body;
  try {
    const list = await ShoppingList.findById(listId).populate('members', 'username');
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }
    res.json({ members: list.members });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Error fetching members' });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
