export default () => ({
  port: parseInt(process.env.PORT, 10) || 3001,
  database: {
    uri: process.env.DATABASE_URL || 'mongodb://localhost:27017/product-db',
  },
});
