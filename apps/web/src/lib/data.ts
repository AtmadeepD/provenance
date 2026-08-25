import fs from 'fs/promises';
import path from 'path';
import { AirlineData } from './types';

/**
 * Loads airline data from the built JSON file on disk.
 * Must be called from a Server Component.
 */
export async function getAirline(slug: string): Promise<AirlineData | null> {
  // Try to locate the build dir. Depending on where Next.js runs from,
  // process.cwd() is usually the Next.js root (apps/web).
  const dataPath = path.join(process.cwd(), '../../data/build/airlines', `${slug}.json`);
  
  try {
    const fileContent = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(fileContent) as AirlineData;
  } catch (err) {
    console.error(`Error loading airline data for ${slug}:`, err);
    return null;
  }
}
