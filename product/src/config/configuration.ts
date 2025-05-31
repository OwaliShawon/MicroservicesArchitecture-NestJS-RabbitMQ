export default () => ({
  port: parseInt(process.env.PORT, 10) || 3001,
  database: {
    uri:
      process.env.MONGODB_URI ||
      'mongodb://root:rootpass@product-mongo:27017/product-db?authSource=admin',
  },
});
