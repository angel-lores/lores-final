const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
export async function api(path, init) {
    const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers || {})
        },
        ...init
    });
    if (res.status === 204) {
        return undefined;
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Request failed");
    }
    return data;
}
