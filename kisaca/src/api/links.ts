import api from "@/lib/axios";
import { IS_TESTING } from "@/lib/config";

let mockLinks = [
  {
    id: 1,
    short_url: "abc123",
    original_url: "https://example.com/some/long/url",
    click_count: 214,
    created_at: "2025-09-20T11:00:00Z",
  },
  {
    id: 2,
    short_url: "go42",
    original_url: "https://kure.ai/docs/microservices",
    click_count: 98,
    created_at: "2025-09-28T15:40:00Z",
  },
  {
    id: 3,
    short_url: "tailwind",
    original_url: "https://tailwindcss.com/docs/installation",
    click_count: 12,
    created_at: "2025-10-05T08:15:00Z",
  },
];

export const fetchLinks = async (page = 1, limit = 5) => {
  if (IS_TESTING) {
    console.info(`[Mock API] fetchLinks(page=${page}, limit=${limit})`);
    await new Promise((r) => setTimeout(r, 400));

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = mockLinks.slice(start, end);

    return {
      items: paginated,
      meta: {
        page,
        limit,
        total: mockLinks.length,
        total_pages: Math.ceil(mockLinks.length / limit),
      },
    };
  }

  const res = await api.get(`/shortlinks?page=${page}&limit=${limit}`);
  return res.data;
};

export async function fetchLinkById(id: number) {
  if (IS_TESTING) {
    console.info(`[Mock API] fetchLinkById(${id})`);
    await new Promise((r) => setTimeout(r, 300));
    const found = mockLinks.find((l) => l.id === id);
    if (!found) throw new Error("Mock: Link not found");
    return found;
  }

  const res = await api.get(`/shortlinks/by-id/${id}`);
  return res.data;
}


export async function fetchLinkByShortUrl(shortUrl: string) {
  if (IS_TESTING) {
    console.info(`[Mock API] fetchLinkByShortUrl(${shortUrl})`);
    await new Promise((r) => setTimeout(r, 300));
    const found = mockLinks.find((l) => l.short_url === shortUrl);
    if (!found) throw new Error("Mock: Link not found");
    return found;
  }
  const res = await api.get(`/shortlinks/short-url/${encodeURIComponent(shortUrl)}`);
  return res.data;
}


export async function createLink(data: { target_url: string }) {
  if (IS_TESTING) {
    console.info(`[Mock API] createLink(${data.target_url})`);
    await new Promise((r) => setTimeout(r, 500));
    const newLink = {
      id: mockLinks.length + 1, // ✅ her zaman benzersiz
      short_url: `http://localhost:3000/${Math.random().toString(36).substring(7)}`,
      original_url: data.target_url,
      click_count: 0,
      created_at: new Date().toISOString(),
    };
    mockLinks = [newLink, ...mockLinks];
    console.log("mockLinks:", mockLinks);
    return newLink;
  }
  const res = await api.post("/shortlinks", data);
  return res.data;
}


export async function updateLink(
  id: number,
  data: { original_url: string; short_url: string }
) {
  if (IS_TESTING) {
    console.info(`[Mock API] updateLink(${id})`);
    await new Promise((r) => setTimeout(r, 500));
    const idx = mockLinks.findIndex((l) => l.id === id);
    if (idx === -1) throw new Error("Mock: Link not found");

    mockLinks[idx] = { ...mockLinks[idx], ...data };
    return mockLinks[idx];
  }

  const res = await api.patch(`/shortlinks/by-id/${id}`, data);
  return res.data;
}

export async function deleteLink(id: number) {
  if (IS_TESTING) {
    console.info(`[Mock API] deleteLink(${id})`);
    await new Promise((r) => setTimeout(r, 300));
    mockLinks = mockLinks.filter((l) => l.id !== id);
    return { message: "Mock: Link deleted" };
  }

  const res = await api.patch(`/shortlinks/by-id/${id}/deactivate`);
  return res.data;
}
