const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email'
    }
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false
  },
  likeSongId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song'
  }],
  likeAlbumId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album'
  }],
  likePodcastId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Podcast'
  }],
  playlistId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const songSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Please provide song name'],
      trim: true
    },
    author: {
      type: String,
      required: [true, 'Please provide song author']
    },
    songImage: {
      type: String,
      default: 'default-song-image.jpg'
    },
    songUrl: {
      type: String,
      required: [true, 'Please provide song URL']
    },
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album'
    },
    genre: {
      type: String,
      enum: ['Worship', 'Gospel', 'Christian Rock', 'Contemporary Christian', 'Hymn', 'Other'],
      default: 'Other'
    },
    duration: {
      type: Number, // Duration in seconds
      default: 0
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });

const albumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide album name'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Please provide album author']
  },
  songImage: {
    type: String,
    default: 'default-album-image.jpg'
  },
  songUrl: {
    type: String
  },
  songIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song'
  }]
});

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide playlist name'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Please provide playlist author']
  },
  songImage: {
    type: String,
    default: 'default-playlist-image.jpg'
  },
  songUrl: {
    type: String
  },
  songIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song'
  }]
});

const podcastSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide podcast name'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Please provide podcast author']
  },
  songImage: {
    type: String,
    default: 'default-podcast-image.jpg'
  },
  songUrl: {
    type: String,
    required: [true, 'Please provide podcast URL']
  },
  songIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song'
  }]
});

const User = mongoose.model('User', userSchema);
const Song = mongoose.model('Song', songSchema);
const Album = mongoose.model('Album', albumSchema);
const Playlist = mongoose.model('Playlist', playlistSchema);
const Podcast = mongoose.model('Podcast', podcastSchema);

songSchema.virtual('album', {
    ref: 'Album',
    localField: 'albumId',
    foreignField: '_id',
    justOne: true
  });
  
  songSchema.virtual('creator', {
    ref: 'User',
    localField: 'createdBy',
    foreignField: '_id',
    justOne: true
  });

module.exports = {
  User,
  Song,
  Album,
  Playlist,
  Podcast
};