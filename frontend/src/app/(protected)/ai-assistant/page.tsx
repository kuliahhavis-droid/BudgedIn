import { AiAssistantPage } from '@/features/ai-assistant/ai-assistant-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Asisten AI | BudgedIn',
  description: 'Konsultasi finansial dan pencatatan transaksi cerdas menggunakan Gemini AI',
};

export default function Page() {
  return <AiAssistantPage />;
}
