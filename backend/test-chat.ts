import { aiService } from './src/services/ai.service.js';
import { prisma } from './src/lib/prisma.js';

async function run() {
  try {
    const user = await prisma.profile.findFirst();
    if (!user) {
      console.log("No user profile found in DB!");
      return;
    }
    console.log("Using user:", user.id, user.fullName);
    const res = await aiService.processChat(user.id, "Halo asisten! Berapa sisa saldo saya?");
    console.log("Chat Response Success:", res);
  } catch (err) {
    console.error("Chat Response Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
