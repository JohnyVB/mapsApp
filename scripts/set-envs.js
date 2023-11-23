require('dotenv').config();
const { writeFileSync, mkdirSync } = require('fs');

const targetPath = './src/environments/environment.ts';

const envFileContent = `
export const environment = {
  mapbox_key: "${process.env['MAPBOX_KEY']}"
}`;

mkdirSync('./src/environments', { recursive: true });
writeFileSync(targetPath, envFileContent);
