export default async function handler(req, res) {
  const { id } = req.query; // orn: @kanald
  if (!id) return res.status(400).send("Kanal ID eksik.");

  try {
    // Eger id "watch?v=" iceriyorsa direkt onu kullan, yoksa kanal id'si varsayip sonuna /live ekle
    const url = id.includes('watch?v=') ? `https://www.youtube.com/${id}` : `https://www.youtube.com/${id}/live`;
    
    // YouTube'a normal bir kullanici gibi baglaniyoruz
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });
    
    const text = await response.text();
    
    // Sayfanin icinden gizli HLS (m3u8) canli yayin baglantisini ayikliyoruz
    const match = text.match(/ytInitialPlayerResponse\s*=\s*({.+?})\s*;/);
    
    if (match) {
      const data = JSON.parse(match[1]);
      const hlsUrl = data?.streamingData?.hlsManifestUrl;
      
      if (hlsUrl) {
        // Bulunan gercek canli yayin linkini televizyona Yonlendir (Redirect) ediyoruz!
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate'); // Asiri yuku onlemek icin 1 dk onbellek
        return res.redirect(302, hlsUrl);
      } else {
        return res.status(404).send("Canli yayin su an aktif degil veya baglanti bulunamadi.");
      }
    }
    
    return res.status(404).send("YouTube yayini cozumlenemedi.");
  } catch (error) {
    return res.status(500).send("Sunucu hatasi: " + error.message);
  }
}
