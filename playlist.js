export default function handler(req, res) {
  // Sunucunun kendi adresini aliyoruz
  const host = req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const baseUrl = `${protocol}://${host}/api/play?id=`;

  // Buraya istediginiz kadar youtube kanali ekleyebilirsiniz!
  const channels = [
    { name: "Kanal D", id: "@kanald", group: "Ulusal" },
    { name: "Show TV", id: "@ShowTV", group: "Ulusal" },
    { name: "ATV", id: "@atv", group: "Ulusal" },
    { name: "TRT 1", id: "@trt1", group: "Ulusal" },
    { name: "A Haber", id: "@ahaber", group: "Haber" },
    { name: "NTV", id: "@NTV", group: "Haber" },
    { name: "Habertürk", id: "@HaberturkTV", group: "Haber" },
    { name: "Halk TV", id: "@Halktv", group: "Haber" },
    { name: "Sözcü TV", id: "@Sozcutelevizyonu", group: "Haber" },
    { name: "TV8", id: "@tv8", group: "Ulusal" },
    { name: "Kral Pop", id: "@KralPopTV", group: "Müzik" },
    { name: "Çukur Canlı (7/24)", id: "watch?v=nZntWwlV3BA", group: "Dizi" }
  ];

  let m3u = "#EXTM3U\n\n";
  
  for (const ch of channels) {
    m3u += `#EXTINF:-1 tvg-id="${ch.name}" tvg-name="${ch.name}" tvg-logo="" group-title="${ch.group}",${ch.name}\n`;
    m3u += `${baseUrl}${ch.id}\n\n`;
  }

  // Bu dosyanin iptv (m3u) oldugunu televizyona bildiriyoruz
  res.setHeader('Content-Type', 'audio/mpegurl');
  res.status(200).send(m3u);
}
