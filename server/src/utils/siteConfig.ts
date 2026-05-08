import SiteConfig from '../models/SiteConfig.js';

export const getSiteConfig = async () => {
  let config = await SiteConfig.findOne();
  if (!config) {
    config = await SiteConfig.create({});
  }
  return config;
};
