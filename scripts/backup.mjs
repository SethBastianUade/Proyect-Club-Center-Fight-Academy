// Exporta la base D1 de producción a backups/ccfa-AAAA-MM-DD.sql.
// La carpeta backups/ no se sube a git: tiene datos personales (interesados).
// Para restaurar: npx wrangler d1 execute DB --remote --file backups/<archivo>.sql
import { execSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

mkdirSync('backups', { recursive: true });
const archivo = `backups/ccfa-${new Date().toISOString().slice(0, 10)}.sql`;
execSync(`npx wrangler d1 export DB --remote --output ${archivo}`, { stdio: 'inherit' });
console.log(`Backup guardado en ${archivo}`);
