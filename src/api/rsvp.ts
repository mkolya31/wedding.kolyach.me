export type RsvpPayload = {
    name: string;
    i_will_come?: string;
    alcohol?: string;
    meal?: string;
    need_transfer?: string;
    hosting_help?: string;

    /**
     * Honeypot-поле против простых ботов.
     * На нормальной форме оно должно оставаться пустым.
     */
    website?: string;
};

export type RsvpResponse = {
    ok: boolean;
    error?: string;
};

const RSVP_REQUEST_TIMEOUT_MS = 15_000;

export async function submitRsvp(payload: RsvpPayload): Promise<RsvpResponse> {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), RSVP_REQUEST_TIMEOUT_MS);
    let response: Response;
    let data: RsvpResponse;

    try {
        response = await fetch('/api/rsvp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: payload.name,
                i_will_come: payload.i_will_come ?? '',
                alcohol: payload.alcohol ?? '',
                meal: payload.meal ?? '',
                need_transfer: payload.need_transfer ?? '',
                hosting_help: payload.hosting_help ?? '',
                website: payload.website ?? ''
            }),
            signal: controller.signal
        });
        data = (await response.json()) as RsvpResponse;
    } finally {
        window.clearTimeout(timeoutId);
    }

    if (!response.ok || !data.ok) {
        throw new Error(data.error || 'RSVP_SUBMIT_FAILED');
    }

    return data;
}
