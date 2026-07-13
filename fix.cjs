const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Strip the <USER_REQUEST> tags if present
content = content.replace(/<USER_REQUEST>/g, '').replace(/<\/USER_REQUEST>/g, '').trim();

// Strip any trailing <ADDITIONAL_METADATA> ... </ADDITIONAL_METADATA> if it got included
content = content.replace(/<ADDITIONAL_METADATA>[\s\S]*?<\/ADDITIONAL_METADATA>/g, '').trim();

if (!content.includes('<!DOCTYPE html>')) {
  content = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Wedding Invitation</title>
<!-- Tabler Icons -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
</head>
<body>
${content}
</body>
</html>`;
}

fs.writeFileSync('index.html', content, 'utf8');
