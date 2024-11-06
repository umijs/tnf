import { request } from '@/utils/importAllFrom';

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}
