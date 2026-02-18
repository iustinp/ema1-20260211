export default function decorate(block) {
  const rows = [...block.children];
  const mediaRow = rows[0];
  const textRow = rows[1];

  // Detect video URL from img src (parser stores .mp4 URL in an img tag)
  const img = mediaRow?.querySelector('img');
  const src = img?.getAttribute('src') || '';
  const isVideo = src.endsWith('.mp4') || src.includes('/is/content/');

  if (isVideo && src) {
    const video = document.createElement('video');
    video.classList.add('hero-video-bg');
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');
    video.muted = true; // programmatic mute for autoplay policy

    const source = document.createElement('source');
    source.setAttribute('src', src);
    source.setAttribute('type', 'video/mp4');
    video.append(source);

    // Replace the media row content with the video
    mediaRow.textContent = '';
    mediaRow.append(video);
  }

  // Mark the text row for styling
  if (textRow) {
    textRow.classList.add('hero-video-text');
  }
}
