const cloudConfig = {
  AWS_END_POINT: process.env.AWS_END_POINT,
  ACCESS_KEY: process.env.ACCESS_KEY,
  SECRET_KEY: process.env.SECRET_KEY,
  REGION: process.env.REGION,
  BUCKET_NAME: process.env.BUCKET_NAME,
};

module.exports = cloudConfig;
