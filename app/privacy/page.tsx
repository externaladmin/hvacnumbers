import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy — hvacnumbers",
  description: "hvacnumbers privacy policy: what data we collect and how it's used.",
};

export default function PrivacyPage() {
  return (
    <main>
      <div className="card prose">
        <h1>Privacy Policy</h1>
        <p>
          hvacnumbers.com (&ldquo;hvacnumbers,&rdquo; &ldquo;we&rdquo;) provides a free
          calculator tool for HVAC technicians. This page explains what data we collect
          and how it&rsquo;s used. Using the calculator itself never requires an
          account, login, or personal information.
        </p>

        <h2>What we collect</h2>
        <p>
          The calculator runs entirely in your browser and does not send your readings
          anywhere unless you choose to save a job record. If you use the optional
          &ldquo;Save this job record&rdquo; feature, we collect the email address you
          provide (required), and the name and site address you provide (optional),
          along with the pressure readings and result you entered.
        </p>
        <p>
          We also collect standard, aggregated website analytics (pages viewed, device
          type, approximate location) via Google Analytics (GA4).
        </p>

        <h2>How it&rsquo;s used</h2>
        <ul>
          <li>
            Job record data (email, optional name, optional site address, and your
            readings) is stored in our database, hosted by Supabase, so we can send you
            a copy of your job record.
          </li>
          <li>
            We send that job record to you by email using Resend, our transactional
            email provider.
          </li>
          <li>
            Your email address may also be added to our mailing list via Beehiiv,
            tagged by which calculator you used, so we can occasionally share new tools
            and updates. You can unsubscribe from any email we send at any time.
          </li>
          <li>
            Aggregated analytics data (via Google Analytics) helps us understand how the
            tool is used so we can improve it.
          </li>
        </ul>

        <h2>What we don&rsquo;t do</h2>
        <p>
          We don&rsquo;t sell your data. We don&rsquo;t require an account or login to
          use the calculator. We don&rsquo;t gate the result behind an email form — the
          job record email capture is always optional and always appears after your
          result, never before.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy or your data can be sent to{" "}
          <a href="mailto:records@hvacnumbers.com">records@hvacnumbers.com</a>.
        </p>
      </div>
    </main>
  );
}
