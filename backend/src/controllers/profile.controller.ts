import { profileService } from '../services/profile.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { updateProfileSchema, upsertProfileSchema } from '../validators/profile.validator.js';
import { getAvatarUploadUrl, getAvatarPublicUrl } from '../lib/supabase.js';

export const profileController = {
  me: asyncHandler(async (req, res) => {
    res.json({ success: true, data: await profileService.get(req.user!.id) });
  }),
  upsert: asyncHandler(async (req, res) => {
    res.status(201).json({ success: true, data: await profileService.upsert(req.user!.id, upsertProfileSchema.parse(req.body)) });
  }),
  update: asyncHandler(async (req, res) => {
    res.json({ success: true, data: await profileService.update(req.user!.id, updateProfileSchema.parse(req.body)) });
  }),
  avatarUploadUrl: asyncHandler(async (req, res) => {
    const { fileName } = req.query;
    if (!fileName || typeof fileName !== 'string') {
      res.status(400).json({ success: false, message: 'fileName query parameter is required' });
      return;
    }

    const signedUrl = await getAvatarUploadUrl(req.user!.id, fileName);
    const publicUrl = getAvatarPublicUrl(`${req.user!.id}/${fileName}`);

    res.json({
      success: true,
      data: { signedUrl, publicUrl }
    });
  }),
  resetData: asyncHandler(async (req, res) => {
    await profileService.resetData(req.user!.id);
    res.json({ success: true, message: 'All financial data has been reset successfully.' });
  })
};


