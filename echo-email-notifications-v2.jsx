import { useState } from "react";

const emails = [
  {
    id: "first_surge",
    label: "First Surge",
    group: "Surge Milestones",
    trigger: "When a Ping or Wave gets its first Surge (from someone else)",
    subject: "Someone just felt that. 🌊",
    preview: "Your first Surge just landed — you're not alone on this.",
    body: `Hi [Name],

You posted something real. And someone just proved it matters.

Your [Ping / Wave] — "[Title]" — just got its first Surge.

That's one person who saw what you said and thought: yes, this too.

One voice becomes two. Two becomes a movement.

→ See who's with you`,
    note: "CTA opens the Ping/Wave detail page showing the surge count.",
  },
  {
    id: "surge_10",
    label: "10 Surges",
    group: "Surge Milestones",
    trigger: "When a Ping or Wave hits 10 Surges",
    subject: "10 people just said 'same.' 🔺",
    preview: "You're not a lone voice anymore. 10 Surges and climbing.",
    body: `Hi [Name],

10 people have Surged your [Ping / Wave]:

"[Title]"

That's 10 separate people, on their own, deciding your words were worth amplifying.

This is how it starts. Keep watching.

→ See your 10 Surges`,
    note: "Tone: quiet momentum. This is still early — acknowledge it feels small but signal it's meaningful.",
  },
  {
    id: "surge_50",
    label: "50 Surges",
    group: "Surge Milestones",
    trigger: "When a Ping or Wave hits 50 Surges",
    subject: "50 Surges. This one has legs. 📈",
    preview: "50 people are behind this now. That's not a coincidence.",
    body: `Hi [Name],

"[Title]" just crossed 50 Surges.

At this point, this isn't just your opinion — it's a pattern. 50 people from across your institution independently decided this mattered enough to act on.

That's data. And leaders respond to data.

You're building a case.

→ Watch it build`,
    note: "Tone: confidence building. The framing shifts from emotional to strategic — this is becoming undeniable.",
  },
  {
    id: "surge_100",
    label: "100 Surges",
    group: "Surge Milestones",
    trigger: "When a Ping or Wave hits 100 Surges",
    subject: "100 Surges. Hard to ignore now. 💯",
    preview: "Triple digits. Your Ping just crossed a line that's hard to dismiss.",
    body: `Hi [Name],

100 people.

"[Title]" just crossed 100 Surges — and that number means something specific: it's now on the leader dashboard as a high-priority signal.

This isn't a complaint anymore. It's community consensus.

Watch what happens next.

→ See your Ping's impact`,
    note: "Tone: gravity. This is a real institutional moment. Mention the leader dashboard explicitly to close the loop on why Echo exists.",
  },
  {
    id: "surge_500",
    label: "500 Surges",
    group: "Surge Milestones",
    trigger: "When a Ping or Wave hits 500 Surges",
    subject: "500 Surges. You started something. 🔥",
    preview: "Half a thousand people rallied behind your words. This is rare.",
    body: `Hi [Name],

Most posts never reach this.

"[Title]" just hit 500 Surges. That puts it among the most-backed issues ever raised on Echo.

At this scale, you're not just representing yourself. You're the voice of a significant portion of your institution — and the people in charge know it.

This is what accountability looks like when it's earned.

→ See where this stands`,
    note: "Tone: historic weight. Acknowledge rarity. This should feel like a landmark, not just a number.",
  },
  {
    id: "surge_1000",
    label: "1,000 Surges",
    group: "Surge Milestones",
    trigger: "When a Ping or Wave hits 1,000 Surges",
    subject: "1,000 voices. One Ping. ⚡",
    preview: "A thousand people stood behind what you said. That's not a post — that's a movement.",
    body: `Hi [Name],

1,000 Surges.

"[Title]"

Take a moment with that number. A thousand people — individually, of their own accord — decided your words were worth amplifying.

There is no version of this that leadership can dismiss. There is no algorithm that explains this away. This is your institution speaking in one voice, and you gave them the words.

Echo was built for moments like this.

→ See the full picture`,
    note: "Tone: landmark. This is the most emotionally charged email in the sequence. Make it feel historic. Short paragraphs, maximum weight.",
  },
  {
    id: "comment",
    label: "New Comment",
    group: "Engagement",
    trigger: "When someone comments on your Ping",
    subject: "Someone has something to say. 💬",
    preview: "A new comment just landed on your Ping — the conversation is starting.",
    body: `Hi [Name],

Your Ping is turning into a conversation.

[Commenter Name] just replied to "[Ping Title]":

"[Comment preview — first 100 characters]..."

This is how change starts — not just with problems posted, but with people talking about them.

→ Join the conversation`,
    note: "Shows commenter name + truncated comment. CTA goes directly to the comment thread on the Ping detail page.",
  },
  {
    id: "community_pick",
    label: "Community Pick",
    group: "Badges & Status",
    trigger: "When your Wave becomes 'Community Pick'",
    subject: "The community chose yours. 🏅",
    preview: "Your Wave just became the Community Pick — this is the one people believe in.",
    body: `Hi [Name],

Out of every Wave proposed for "[Ping Title]", the community rallied behind yours.

Your Wave — "[Wave Title]" — is now the Community Pick.

That means this isn't just your idea anymore. It belongs to everyone who Surged it. And now, it's the solution that stands the best chance of going somewhere real.

Leaders are watching the top. You're on it.

→ See your Wave`,
    note: "Only triggers for Wave authors. CTA goes to the Wave detail view with the Community Pick badge visible.",
  },
  {
    id: "top_3_enter",
    label: "Entered Top 3",
    group: "Badges & Status",
    trigger: "When your Ping enters the Top 3",
    subject: "You're in the top 3. 🔥",
    preview: "Your Ping just broke into the Top 3 most-Surged on Echo.",
    body: `Hi [Name],

Your Ping — "[Ping Title]" — just entered the Top 3 most-Surged issues on Echo.

That puts it directly in front of institutional leaders when they open their dashboard.

This is the moment a problem stops being personal and starts being institutional. Your voice is carrying others now.

Don't let it stop here.

→ See your Ping in the rankings`,
    note: "CTA goes to the leaderboard/feed with the Ping highlighted.",
  },
  {
    id: "top_3_exit",
    label: "Dropped from Top 3",
    group: "Badges & Status",
    trigger: "When your Ping drops out of the Top 3",
    subject: "Your Ping just dropped out of the top 3. 📉",
    preview: "Another issue overtook yours — but you're still close. Here's how to get back.",
    body: `Hi [Name],

"[Ping Title]" just dropped out of the Top 3.

Another issue overtook it in Surges — which means the window to act is now.

You're not far off. A push from your network could put you right back. Share your Ping. Tell people why it matters. Get the Surges back.

The top 3 is where leaders look first. That's where your Ping needs to be.

→ See the current rankings`,
    note: "Tone: urgency without panic. Frame it as recoverable. This is Echo's best re-engagement trigger — user has something to fight for. CTA goes to the leaderboard so they can see the gap.",
  },
  {
    id: "acknowledged",
    label: "Leader Acknowledges",
    group: "Badges & Status",
    trigger: "When a leader Acknowledges your Ping",
    subject: "They heard you. ✅",
    preview: "A leader just acknowledged your Ping. This is what accountability looks like.",
    body: `Hi [Name],

Something just shifted.

[Leader Name / Role] has officially Acknowledged your Ping:

"[Ping Title]"

That means it's on their radar — logged, seen, and on record. Echo exists so that moments like this happen. You posted it. The community Surged it. Leadership acknowledged it.

Watch what happens next.

→ See the acknowledgement`,
    note: "Shows leader's name and role if public. CTA goes to the Ping detail page where the acknowledgement status/badge is visible.",
  },
];

const groups = ["Surge Milestones", "Engagement", "Badges & Status"];

const groupColors = {
  "Surge Milestones": { bg: "#fdf3e8", text: "#a85c1a", border: "#f5c88a" },
  "Engagement": { bg: "#f0fdf4", text: "#1a6b3c", border: "#86efac" },
  "Badges & Status": { bg: "#f5f0ff", text: "#6b1a9e", border: "#c4b5fd" },
};

const toneLabels = {
  first_surge: "Intimate",
  surge_10: "Quiet momentum",
  surge_50: "Strategic",
  surge_100: "Gravity",
  surge_500: "Historic weight",
  surge_1000: "Landmark",
  comment: "Conversational",
  community_pick: "Earned recognition",
  top_3_enter: "Urgency",
  top_3_exit: "Recovery urgency",
  acknowledged: "Accountability",
};

export default function EchoEmails() {
  const [active, setActive] = useState(0);
  const email = emails[active];
  const gc = groupColors[email.group];

  return (
    <div style={{
      fontFamily: "'Georgia', serif",
      background: "#f7f6f3",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        background: "#111",
        padding: "18px 32px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        borderBottom: "1px solid #222",
      }}>
        <div style={{
          width: 30, height: 30,
          background: "linear-gradient(135deg, #6c63ff, #3ecfcf)",
          borderRadius: 7,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 800, color: "#fff", fontSize: 13,
          fontFamily: "sans-serif", letterSpacing: "-0.5px",
        }}>E</div>
        <span style={{ color: "#fff", fontFamily: "sans-serif", fontWeight: 600, fontSize: 15 }}>
          Echo — Email Notifications
        </span>
        <span style={{ color: "#555", fontFamily: "sans-serif", fontSize: 12, marginLeft: 4 }}>
          v2 · {emails.length} templates
        </span>
      </div>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Sidebar */}
        <div style={{
          width: 220,
          background: "#161616",
          padding: "20px 0",
          flexShrink: 0,
          overflowY: "auto",
        }}>
          {groups.map(group => (
            <div key={group} style={{ marginBottom: 8 }}>
              <div style={{
                padding: "6px 20px 4px",
                color: "#444",
                fontFamily: "sans-serif",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "1.2px",
                textTransform: "uppercase",
              }}>{group}</div>
              {emails.filter(e => e.group === group).map((e, _) => {
                const i = emails.indexOf(e);
                return (
                  <button
                    key={e.id}
                    onClick={() => setActive(i)}
                    style={{
                      display: "block", width: "100%", textAlign: "left",
                      padding: "9px 20px",
                      background: active === i ? "#242424" : "transparent",
                      border: "none",
                      borderLeft: active === i ? "3px solid #6c63ff" : "3px solid transparent",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{
                      color: active === i ? "#fff" : "#888",
                      fontFamily: "sans-serif",
                      fontSize: 12.5,
                      fontWeight: active === i ? 600 : 400,
                    }}>{e.label}</div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: "28px 36px", overflowY: "auto" }}>
          {/* Meta row */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 22, flexWrap: "wrap" }}>
            <div style={{
              background: gc.bg, color: gc.text,
              border: `1px solid ${gc.border}`,
              fontFamily: "sans-serif", fontSize: 11, fontWeight: 700,
              padding: "3px 10px", borderRadius: 20, letterSpacing: "0.4px",
            }}>
              {email.group.toUpperCase()}
            </div>
            <div style={{
              background: "#f0f0f0", color: "#666",
              fontFamily: "sans-serif", fontSize: 11, fontWeight: 600,
              padding: "3px 10px", borderRadius: 20, letterSpacing: "0.4px",
            }}>
              TONE: {toneLabels[email.id]}
            </div>
            <div style={{
              color: "#aaa", fontFamily: "sans-serif", fontSize: 12, fontStyle: "italic",
            }}>
              Trigger: {email.trigger}
            </div>
          </div>

          {/* Email card */}
          <div style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
            overflow: "hidden",
            maxWidth: 600,
          }}>
            {/* Window bar */}
            <div style={{
              background: "#1a1a1a", padding: "11px 20px",
              display: "flex", gap: 7, alignItems: "center",
            }}>
              {["#ff5f57","#febc2e","#28c840"].map(c => (
                <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
              ))}
              <div style={{
                flex: 1, marginLeft: 8,
                background: "#2a2a2a", borderRadius: 4,
                padding: "3px 12px",
                color: "#666", fontFamily: "sans-serif", fontSize: 11,
                textAlign: "center",
              }}>
                echo.community
              </div>
            </div>

            {/* Metadata */}
            <div style={{
              padding: "18px 26px 14px",
              borderBottom: "1px solid #f0f0f0",
              fontFamily: "sans-serif",
            }}>
              {[
                ["From", "Echo <hello@echo.community>"],
                ["To", "[User Name] <[user@email.com]>"],
                ["Subject", email.subject],
              ].map(([label, val]) => (
                <div key={label} style={{ display: "flex", gap: 10, alignItems: "baseline", marginBottom: 5 }}>
                  <span style={{ color: "#bbb", fontSize: 11, width: 52, flexShrink: 0, fontWeight: 600, letterSpacing: "0.3px" }}>
                    {label.toUpperCase()}
                  </span>
                  <span style={{
                    color: label === "Subject" ? "#111" : "#555",
                    fontSize: label === "Subject" ? 14 : 13,
                    fontWeight: label === "Subject" ? 700 : 400,
                    fontFamily: label === "Subject" ? "Georgia, serif" : "sans-serif",
                  }}>{val}</span>
                </div>
              ))}
            </div>

            {/* Preview text */}
            <div style={{
              padding: "8px 26px",
              background: "#fafafa",
              borderBottom: "1px solid #f0f0f0",
              display: "flex", gap: 10, alignItems: "center",
            }}>
              <span style={{ color: "#ccc", fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.8px", flexShrink: 0 }}>
                PREVIEW TEXT
              </span>
              <span style={{ color: "#999", fontFamily: "sans-serif", fontSize: 12, fontStyle: "italic" }}>
                {email.preview}
              </span>
            </div>

            {/* Body */}
            <div style={{ padding: "26px 26px 6px" }}>
              <pre style={{
                fontFamily: "'Georgia', serif",
                fontSize: 15,
                lineHeight: 1.9,
                color: "#1a1a1a",
                whiteSpace: "pre-wrap",
                margin: 0,
              }}>
                {email.body.replace(/→ .+/, "").trim()}
              </pre>

              {/* CTA */}
              <div style={{ margin: "22px 0 26px" }}>
                <div style={{
                  display: "inline-block",
                  background: "#111", color: "#fff",
                  fontFamily: "sans-serif", fontSize: 13, fontWeight: 600,
                  padding: "11px 22px", borderRadius: 6, letterSpacing: "0.2px",
                  cursor: "pointer",
                }}>
                  {email.body.match(/→ (.+)/)?.[1] || "Open Echo →"}
                </div>
              </div>

              {/* Footer */}
              <div style={{
                borderTop: "1px solid #f4f4f4",
                paddingTop: 14, paddingBottom: 18,
                fontFamily: "sans-serif", fontSize: 11,
                color: "#ccc", lineHeight: 1.7,
              }}>
                You're receiving this because you're a member of Echo at [Institution Name].<br />
                <span style={{ textDecoration: "underline", cursor: "pointer" }}>Manage notifications</span>
                {" · "}
                <span style={{ textDecoration: "underline", cursor: "pointer" }}>Unsubscribe</span>
              </div>
            </div>
          </div>

          {/* Dev note */}
          <div style={{
            maxWidth: 600, marginTop: 16,
            padding: "12px 16px",
            background: "#fffbea",
            border: "1px solid #ede080",
            borderRadius: 8,
            fontFamily: "sans-serif", fontSize: 12, color: "#7a6500", lineHeight: 1.65,
          }}>
            <strong>📝 Dev note:</strong> {email.note}
          </div>
        </div>
      </div>
    </div>
  );
}
