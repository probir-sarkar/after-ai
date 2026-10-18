import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Theme sections are looked up by an explicit `key` in the frontmatter, not by
 * collection id: the glob loader's id for these files includes the extension,
 * and the schema enum makes the four valid keys a build-time check.
 */
export async function section(
  key: 'survives' | 'risk' | 'opportunity' | 'what-to-do' | 'possibilities'
): Promise<CollectionEntry<'sections'>> {
  const all = await getCollection('sections');
  const entry = all.find((s) => s.data.key === key);
  if (!entry) {
    throw new Error(`Missing section "${key}". Found keys: ${all.map((s) => s.data.key).join(', ') || '(none)'}`);
  }
  return entry;
}
