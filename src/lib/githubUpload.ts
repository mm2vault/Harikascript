import { firebaseAuth } from './firebase';

const ENDPOINT = import.meta.env.VITE_GITHUB_UPLOAD_ENDPOINT as string | undefined;

export async function uploadAdminFile(file: File, folder = 'cosmetics') {
  if (!ENDPOINT) {
    throw new Error('GitHub yükleme servisi henüz yapılandırılmamış.');
  }
  if (!file.type.startsWith('image/') && file.type !== 'image/gif') {
    throw new Error('Sadece resim ve GIF yüklenebilir.');
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Dosya 10 MB\'dan küçük olmalı.');
  }

  const user = firebaseAuth.currentUser;
  if (!user) throw new Error('Önce admin hesabıyla giriş yap.');
  const idToken = await user.getIdToken();

  const body = new FormData();
  body.append('file', file);
  body.append('folder', folder);

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${idToken}` },
    body
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error || 'GitHub yüklemesi başarısız.');

  return data.url as string;
}

export async function compressAvatarToDataUrl(file: File) {
  if (!file.type.startsWith('image/')) throw new Error('Lütfen bir resim seç.');
  if (file.size > 15 * 1024 * 1024) throw new Error('Avatar resmi 15 MB\'dan küçük olmalı.');

  const bitmap = await createImageBitmap(file);
  const max = 320;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    throw new Error('Avatar resmi işlenemedi.');
  }
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
  return dataUrl.length > 850_000 ? canvas.toDataURL('image/jpeg', 0.68) : dataUrl;
}
