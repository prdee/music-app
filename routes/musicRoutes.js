const express = require('express');
const { Song, Album, Playlist, Podcast, User } = require('../models');
const { protectRoute } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /music/favorites/song:
 *   post:
 *     summary: Add a song to user's favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               songId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Song added to favorites successfully
 *       500:
 *         description: Failed to add song to favorites
 */
router.post('/favorites/song', protectRoute, async (req, res) => {
  try {
    const { songId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.likeSongId.includes(songId)) {
      user.likeSongId.push(songId);
      await user.save();
    }

    res.status(200).json({
      status: 'success',
      data: { likeSongId: user.likeSongId }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to add song to favorites',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /music/songs:
 *   get:
 *     summary: Get all songs
 *     tags: [Songs]
 *     responses:
 *       200:
 *         description: Successfully retrieved songs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     songs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Song'
 *       500:
 *         description: Failed to fetch songs
 */
router.get('/songs', async (req, res) => {
  try {
    const songs = await Song.find().populate('albumId');
    res.status(200).json({
      status: 'success',
      data: { songs }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch songs',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /music/playlist:
 *   post:
 *     summary: Create a new playlist
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               songIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Playlist created successfully
 *       500:
 *         description: Failed to create playlist
 */
router.post('/playlist', protectRoute, async (req, res) => {
  try {
    const { name, songIds } = req.body;
    const playlist = await Playlist.create({
      name,
      author: req.user.username,
      songIds
    });

    const user = await User.findById(req.user._id);
    user.playlistId.push(playlist._id);
    await user.save();

    res.status(201).json({
      status: 'success',
      data: { playlist }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create playlist',
      error: error.message
    });
  }
});

module.exports = router;