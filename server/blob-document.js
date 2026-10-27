import { get } from '@vercel/blob';

export function requireStrongRevision(revision) {
  if (typeof revision !== 'string' || !/^"[^"]+"$/.test(revision)) {
    throw new Error('Blob storage did not provide a strong ETag');
  }
  return revision;
}

// Compressed responses can turn a strong ETag into W/"…". That validator
// cannot be used with Blob's ifMatch, even when the document is unchanged.
// Request the original representation; never strip W/ or omit ifMatch.
export async function readBlobDocument(pathname, options, getBlob = get) {
  const result = await getBlob(pathname, {
    ...options, useCache: false, headers: { 'Accept-Encoding': 'identity' },
  });
  if (!result) return null;
  const revision = requireStrongRevision(result.blob.etag);
  return { data: await new Response(result.stream).json(), revision };
}
