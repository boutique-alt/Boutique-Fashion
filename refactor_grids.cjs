const fs = require('fs');

const files = [
  'src/pages/BridalPage.tsx',
  'src/pages/CategoryPage.tsx',
  'src/pages/FabricPage.tsx',
  'src/pages/ProductPage.tsx',
  'src/pages/ShopAllPage.tsx',
  'src/pages/ShopCategoryLandingPage.tsx',
  'src/pages/WishlistPage.tsx',
  'src/components/sections/ExclusiveCollections.tsx',
  'src/components/sections/OfficeWear.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('<ProductCard') && !content.includes('AnimatedGrid')) {
    // Add import for AnimatedGrid
    let relativePath = file.startsWith('src/pages/') ? '../components/ui/AnimatedGrid' : '../ui/AnimatedGrid';
    if (file === 'src/components/sections/ExclusiveCollections.tsx' || file === 'src/components/sections/OfficeWear.tsx') {
        relativePath = '../ui/AnimatedGrid';
    } else {
        relativePath = '../components/ui/AnimatedGrid';
    }
    
    // Add import below ProductCard
    content = content.replace(/(import ProductCard.*?['"];?)/, `$1\nimport AnimatedGrid from '${relativePath}'`);
    
    // Find grid div around ProductCard mapping
    // Basically replace <div className="grid... with <AnimatedGrid className="grid...
    // and matching </div> with </AnimatedGrid>
    
    // We will use a regex to match the grid div that contains ProductCard
    const regex = /<div\s+(className="grid[^>]+)>\s*\{[^\}]+\.map\([^=>]+\s*=>\s*\(\s*<ProductCard[^>]+>\s*\)\s*\)\s*\}\s*<\/div>/g;
    
    content = content.replace(regex, (match, className) => {
        return match.replace('<div', '<AnimatedGrid').replace('</div>', '</AnimatedGrid>');
    });
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
