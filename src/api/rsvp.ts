export type RsvpPayload = {
    name: string;
    i_will_come?: string;
    alcohol?: string;
    meal?: string;
    need_transfer?: string;

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

export async function submitRsvp(payload: RsvpPayload): Promise<RsvpResponse> {
    const response = await fetch('/api/rsvp', {
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
            website: payload.website ?? ''
        })
    });

    const data = (await response.json()) as RsvpResponse;

    if (!response.ok || !data.ok) {
        throw new Error(data.error || 'RSVP_SUBMIT_FAILED');
    }

    return data;
}