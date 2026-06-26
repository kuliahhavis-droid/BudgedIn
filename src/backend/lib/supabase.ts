import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/env';

const AVATAR_BUCKET = 'avatars';

/** Default signed-URL expiry in seconds (10 minutes). */
const UPLOAD_URL_EXPIRY = 600;

let _supabaseAdmin: SupabaseClient | null = null;

/**
 * Returns a Supabase admin client initialised with the service-role key.
 * Throws a descriptive error when the required env vars are missing.
 */
export const getSupabaseAdmin = (): SupabaseClient => {
  if (_supabaseAdmin) {
    return _supabaseAdmin;
  }

  if (!env.SUPABASE_URL) {
    throw new Error(
      'SUPABASE_URL is not configured. Set it in the environment to use the Supabase admin client.'
    );
  }

  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not configured. Set it in the environment to use the Supabase admin client.'
    );
  }

  _supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  return _supabaseAdmin;
};

/**
 * Generates a signed upload URL for an avatar in the `avatars` storage bucket.
 *
 * The resulting URL can be used by the client to upload a file directly to
 * Supabase Storage via a PUT request within the expiry window.
 *
 * @param userId  - The authenticated user's ID (used as folder prefix).
 * @param fileName - The desired file name (e.g. `avatar.png`).
 * @returns The signed upload URL.
 */
export const getAvatarUploadUrl = async (
  userId: string,
  fileName: string
): Promise<string> => {
  const supabase = getSupabaseAdmin();
  const path = `${userId}/${fileName}`;

  const { data, error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data?.signedUrl) {
    throw new Error(
      `Failed to create signed upload URL for "${path}": ${error?.message ?? 'unknown error'}`
    );
  }

  return data.signedUrl;
};

/**
 * Returns the public URL for an avatar stored in the `avatars` bucket.
 *
 * @param path - The storage path relative to the bucket root (e.g. `<userId>/avatar.png`).
 * @returns The public URL string.
 */
export const getAvatarPublicUrl = (path: string): string => {
  const supabase = getSupabaseAdmin();

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);

  return data.publicUrl;
};
