import { profileRepository } from '../repositories/profile.repository.js';
export const profileService = {
    get: profileRepository.get,
    upsert: profileRepository.upsert,
    update: profileRepository.update
};
