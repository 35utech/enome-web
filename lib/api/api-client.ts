export async function apiClient<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });

    if (!res.ok) {
        let errorMessage = "An error occurred while fetching the data.";
        try {
            const errorData = await res.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            // Fallback if not JSON
        }
        throw new Error(errorMessage);
    }

    return res.json();
}
