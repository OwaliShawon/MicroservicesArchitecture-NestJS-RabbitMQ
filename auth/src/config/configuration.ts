export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    uri:
      process.env.DATABASE_URI ||
      'mongodb://root:rootpass@auth-mongo:27017/auth-db?authSource=admin',
  },
});
