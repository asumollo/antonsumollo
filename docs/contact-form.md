# Contact form

A message from the "Get in touch" form lands in Anton's Gmail. Same idea as Yonder Resume's
feedback (`yonder-resume-app/docs/specs/2026-10-07-feedback-design.md`): a Google Apps Script
web app mails it with `MailApp`. No email service, no database.

## The flow

```
Browser form ──POST──▶ /api/contact (Next.js) ──POST + secret──▶ Apps Script ──MailApp──▶ Gmail
```

The browser never sees the script's URL or the secret. They live in `.env.local` and are only
read by the route on the server.

## How you know it came from the website

| Where | What you see |
|---|---|
| Subject | `[WEB] Message from Jane Doe` |
| Body footer | `Sent from the contact form on <site URL>` plus the visitor's email and the time |
| Reply-To | The visitor's email, when it looks valid, so Reply goes straight to them |
| Gmail label | A filter on `subject:"[WEB]"` files them under a **Web** label |
| Secret | The script drops any request without the shared secret, so nobody can send mail through the script's URL directly |

## Setup

1. **Make the script.** Go to <https://script.google.com>, choose **New project**, and name it
   "Web contact". Replace `Code.gs` with the script below and save.
2. **Make a secret.** In Terminal, run `openssl rand -hex 32` and copy the output.
3. **Store the secret in the script.** Go to **Project Settings ⚙ › Script properties ›
   Add script property**. Name it `SECRET` and paste the value.
4. **Grant the mail permission.** In the editor, pick `authorize` in the function dropdown and
   click **Run**. Allow the permissions. Google warns the app is unverified, because it's yours:
   choose **Advanced › Go to Web contact**.
5. **Deploy.** Go to **Deploy › New deployment › type: Web app**.
   - Description: anything.
   - **Execute as: Me.**
   - **Who has access: Anyone.**

   Deploy, then copy the **Web app URL**. It ends in `/exec`.
6. **Give the site both values.** Add them to `.env.local` in the project root. The file is
   gitignored. Do the same in Vercel's Environment Variables once the site is deployed.
   ```
   CONTACT_SCRIPT_URL=https://script.google.com/macros/s/…/exec
   CONTACT_SECRET=<the same hex string as step 2>
   ```
7. **Optional: add the Gmail label.** In Gmail, search `subject:"[WEB]"`, then go to
   **Show search options › Create filter › Apply the label: Web** (new label).
8. **Restart the dev server** so it reads `.env.local`.

### Changing the script later

Edit it, then go to **Deploy › Manage deployments › ✎ › Version: New version**. That keeps the
same URL. A *New deployment* makes a new URL, and the site would keep posting to the old one.

### Testing the script by hand

Apps Script answers with a redirect that must be followed as a GET. `curl -L --data` does that;
`-X POST` breaks it:

```
curl -sL "$CONTACT_SCRIPT_URL" -H 'Content-Type: application/json' \
  --data '{"secret":"<secret>","name":"Test","email":"","message":"hello"}'
```

## Code.gs

```js
const MAX_MESSAGE = 5000;
const MAX_FIELD = 200;
const SITE = 'https://example.com'; // your live domain, shown in the email footer

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const secret = PropertiesService.getScriptProperties().getProperty('SECRET');
    if (!secret || body.secret !== secret) return reply({ ok: false, error: 'forbidden' });

    const message = String(body.message || '').trim().slice(0, MAX_MESSAGE);
    if (!message) return reply({ ok: false, error: 'empty' });
    const name = String(body.name || '').trim().slice(0, MAX_FIELD);
    const email = String(body.email || '').trim().slice(0, MAX_FIELD);
    if (MailApp.getRemainingDailyQuota() < 1) return reply({ ok: false, error: 'quota' });

    const options = { name: 'Web contact form' };
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) options.replyTo = email;

    MailApp.sendEmail(
      Session.getEffectiveUser().getEmail(),
      `[WEB] Message from ${name || email || 'a visitor'}`,
      `${message}\n\n---\nSent from the contact form on ${SITE}\nName: ${name || '(not given)'}\nEmail: ${email || '(not given)'}\nTime: ${new Date().toISOString()}`,
      options,
    );
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: 'bad request' });
  }
}

// Run once from the editor to grant the mail permission.
function authorize() { MailApp.getRemainingDailyQuota(); }

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
```
