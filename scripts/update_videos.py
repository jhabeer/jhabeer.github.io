#!/usr/bin/env python3
"""Refresh assets/videos.json from the public YouTube RSS feed of @jabdulmedia.
Only videos the channel has made public appear in the feed. Titles that look like
the old Web3/airdrop uploads are skipped so the site stays about AI and websites.
YouTube Shorts are also skipped: the site only lists full-length videos."""
import json, re, html, urllib.request, datetime, pathlib

CHANNEL_ID = "UCstd2Mk6sJF5Y8oCo-fQXKg"
SKIP = re.compile(r"airdrop|web3|crypto|nft|defi|testnet|token|bitcoin|binance", re.I)
UA = {"User-Agent": "Mozilla/5.0"}


def is_short(video_id):
    """A Short stays on /shorts/<id> after redirects; a full video is sent to /watch."""
    url = f"https://www.youtube.com/shorts/{video_id}"
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            final = resp.geturl()
    except urllib.error.HTTPError as e:
        final = e.headers.get("Location") or getattr(e, "url", "") or ""
    return "/shorts/" in final and "/watch" not in final


url = f"https://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL_ID}"
req = urllib.request.Request(url, headers=UA)
xml = urllib.request.urlopen(req, timeout=30).read().decode("utf-8")
vids = []
for e in re.findall(r"<entry>(.*?)</entry>", xml, re.S):
    vid = re.search(r"<yt:videoId>(.*?)</yt:videoId>", e).group(1)
    title = html.unescape(re.search(r"<title>(.*?)</title>", e).group(1))
    pub = re.search(r"<published>(\d{4}-\d{2}-\d{2})", e).group(1)
    if SKIP.search(title):
        continue
    if is_short(vid):
        print("Skipping Short", vid, title)
        continue
    vids.append({"id": vid, "title": title, "published": pub})
if not vids:
    raise SystemExit("No videos found; leaving videos.json unchanged")
path = pathlib.Path(__file__).resolve().parent.parent / "assets" / "videos.json"
old = json.loads(path.read_text()) if path.exists() else {}
if old.get("videos") == vids:
    print("No change"); raise SystemExit(0)
data = {"channel": "https://www.youtube.com/@jabdulmedia", "updated": datetime.date.today().isoformat(), "videos": vids}
path.write_text("{\"channel\":%s,\"updated\":%s,\"videos\":[\n%s\n]}\n" % (
    json.dumps(data["channel"]), json.dumps(data["updated"]),
    ",\n".join(json.dumps(v, ensure_ascii=False) for v in vids)))
print("Updated", len(vids), "videos")
