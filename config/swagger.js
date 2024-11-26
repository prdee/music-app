const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Jesus Music App API',
      version: '1.0.0',
      description: 'API documentation for the Jesus Music App',
      contact: {
        name: 'API Support',
        email: 'support@jesusmusic.app'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Local development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            username: { type: 'string' },
            email: { type: 'string' },
            likeSongId: { type: 'array', items: { type: 'string' } },
            likeAlbumId: { type: 'array', items: { type: 'string' } }
          }
        },
        Song: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            author: { type: 'string' },
            songImage: { type: 'string' },
            songUrl: { type: 'string' }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'] // Path to the API route files
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;