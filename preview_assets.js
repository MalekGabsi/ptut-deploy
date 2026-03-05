import fs from 'fs';
import path from 'path';

const assetsDir = path.join(process.cwd(), 'public', 'assets');
const files = fs.readdirSync(assetsDir).filter(f => f.match(/\.(png|jpe?g|svg)$/i));

const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { background: #333; color: white; font-family: sans-serif; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
        .item { text-align: center; border: 1px solid #555; padding: 10px; }
        img { max-width: 100%; max-height: 150px; }
        .name { font-size: 11px; margin-top: 5px; word-break: break-all; }
    </style>
</head>
<body>
    <div class="grid">
        ${files.map(f => `
            <div class="item">
                <img src="./public/assets/${f}" />
                <div class="name">${f}</div>
            </div>
        `).join('')}
    </div>
</body>
</html>
`;

fs.writeFileSync('assets_preview.html', html);
console.log('Created assets_preview.html');
