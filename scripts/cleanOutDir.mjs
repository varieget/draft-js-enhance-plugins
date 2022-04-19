import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

try {
  const files = await fs.readdir(path.resolve(__dirname, '../packages'));

  for (const file of files) {
    try {
      await fs.rm(path.resolve(__dirname, '../packages', file, 'lib'), {
        recursive: true,
        force: true,
      });

      console.log(`The output directory of ${file} was deleted.`);
    } catch (err) {
      throw new Error(err);
    }
  }
} catch (err) {
  throw new Error(err);
}
