import { apiGet, apiPatch, apiDelete } from './api';
import { supabase } from '../lib/supabase';
import type { Profile, UpdateProfileInput } from '../types';

export const profileService = {
  getProfile: async () => {
    const response = await apiGet<Profile>('/profile/me');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileInput) => {
    const response = await apiPatch<Profile>('/profile/me', data);
    return response.data;
  },

  resetData: async () => {
    const response = await apiDelete<void>('/profile/reset-data');
    return response.data;
  },


  uploadAvatar: async (file: File) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      throw new Error('Not authenticated');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    const avatarUrl = urlData.publicUrl;

    // Update profile with new avatar URL
    const response = await apiPatch<Profile>('/profile/me', { avatarUrl });
    return response.data;
  },

  changePassword: async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw new Error(error.message);
    }
  },
};
