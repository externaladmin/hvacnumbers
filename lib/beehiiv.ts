const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;
const BEEHIIV_PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;

export const beehiivEnabled = Boolean(BEEHIIV_API_KEY && BEEHIIV_PUBLICATION_ID);

// No-ops until BEEHIIV_API_KEY is set in the environment. Returns whether the
// subscriber was successfully synced so the caller can record it.
export async function addBeehiivSubscriber(
  email: string,
  tag: string
): Promise<boolean> {
  if (!beehiivEnabled) {
    return false;
  }

  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BEEHIIV_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: false,
          send_welcome_email: false,
          utm_source: "hvacnumbers",
          tags: [tag],
        }),
      }
    );

    return res.ok;
  } catch (error) {
    console.error("Beehiiv subscribe failed:", error);
    return false;
  }
}
