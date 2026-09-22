const MAX_BYTES = 10 * 1024 * 1024;
const ADMIN_EMAIL = 'mm2ultimatehub@gmail.com';
const OWNER = 'mm2vault';
const REPO = 'Harikascript';
const BRANCH = 'main';

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

function safeName(name: string) {
  return name.normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120) || 'upload';
}

export default async (req: Request) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  const githubToken = Netlify.env.get('GITHUB_TOKEN');
  const firebaseApiKey = Netlify.env.get('FIREBASE_API_KEY');
  if (!githubToken || !firebaseApiKey) {
    return json({ error: 'Upload servisi yapılandırılmamış.' }, 500);
  }

  const auth = req.headers.get('Authorization') || '';
  if (!auth.startsWith('Bearer ')) return json({ error: 'Oturum gerekli.' }, 401);
  const idToken = auth.slice(7).trim();
  if (!idToken) return json({ error: 'Oturum gerekli.' }, 401);

  const authResponse = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(firebaseApiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    }
  );
  if (!authResponse.ok) return json({ error: 'Firebase oturumu doğrulanamadı.' }, 401);

  const authData = await authResponse.json() as { users?: Array<{ email?: string; disabled?: boolean }> };
  const user = authData.users?.[0];
  if (!user || user.disabled || user.email?.toLowerCase() !== ADMIN_EMAIL) {
    return json({ error: 'Bu yükleme sadece admin hesabına açıktır.' }, 403);
  }

  const form = await req.formData();
  const entry = form.get('file');
  if (!(entry instanceof File)) return json({ error: 'Dosya bulunamadı.' }, 400);
  if (!entry.type.startsWith('image/') && entry.type !== 'image/gif') {
    return json({ error: 'Sadece resim ve GIF yüklenebilir.' }, 400);
  }
  if (entry.size > MAX_BYTES) return json({ error: 'Dosya 10 MB\'dan küçük olmalı.' }, 400);

  const bytes = new Uint8Array(await entry.arrayBuffer());
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  const content = btoa(binary);
  const filename = `${Date.now()}-${safeName(entry.name)}`;
  const path = `public/uploads/cosmetics/${filename}`;

  const githubResponse = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2026-03-10'
      },
      body: JSON.stringify({
        message: `upload: add cosmetic ${filename}`,
        branch: BRANCH,
        content
      })
    }
  );

  if (!githubResponse.ok) {
    const detail = await githubResponse.json().catch(() => ({})) as { message?: string };
    return json({ error: detail.message || 'GitHub yüklemesi başarısız.' }, githubResponse.status);
  }

  return json({
    url: `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${path}`,
    path
  }, 201);
};

export const config = {
  path: '/api/github-upload'
};
