import { profileRepository, type ProfileInput, type ProfileUpdateInput } from '../repositories/profile.repository.js';

export const profileService = {
  get: profileRepository.get,
  upsert: profileRepository.upsert,
  update: profileRepository.update,
  resetData: profileRepository.resetData
};


export type { ProfileInput, ProfileUpdateInput };

