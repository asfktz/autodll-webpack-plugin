import crypto from 'crypto';

const createHash = settings => {
  const hash = crypto.createHash('md5');
  const settingsJSON = JSON.stringify(settings);

  hash.update(settingsJSON);

  return [settings.env, settings.id, hash.digest('hex')].join('_');
};

export default createHash;
