const GITHUB_OWNER = 'mm2vault';
const GITHUB_REPO = 'Harikascript';
const GITHUB_BRANCH = 'main';
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

function safeName(name: string) {
  return name
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120) || 'upload';
}

function base64FromBytes(bytes: Uint8Array) {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export async function uploadAdminFile(file: File, token: string, folder = 'cosmetics') {
  if (!token.trim()) throw new Error('GitHub yükleme anahtarını gir.');
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('Dosya 10 MB'dan küçük olmalı.');
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const filename = `${Date.now()}-${safeName(file.name)}`;
  const path = `public/uploads/${folder}/${filename}`;
  const content = base64FromBytes(bytes);

  const response = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token.trim()}`,
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2026-03-10'
      },
      body: JSON.stringify({
        message: `upload: add ${filename}`,
        branch: GITHUB_BRANCH,
        content
      })
    }
  );

  if (!response.ok) {
    let detail = '';
    try {
      const data = await response.json();
      detail = data?.message ? ` ${data.message}` : '';
    } catch {}
    if (response.status === 401 || response.status === 403) {
      throw new Error(`GitHub yetkisi reddedildi.${detail} Token'ın Harikascript reposunda Contents: Read and write yetkisi olmalı.`);
    }
    throw new Error(`GitHub yükleme başarısız (${response.status}).${detail}`);
  }

  return `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${path}`;
}

export async function compressAvatarToDataUrl(file: File) {
  if (!file.type.startsWith('image/')) throw new Error('Lütfen bir resim seç.');
  if (file.size > 15 * 1024 * 1024) throw new Error('Avatar resmi 15 MB'dan küçük olmalı.');

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
  if (dataUrl.length > 850_000) {
    return canvas.toDataURL('image/jpeg', 0.68);
  }
  return dataUrl;
}
