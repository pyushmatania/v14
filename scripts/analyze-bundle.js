#!/usr/bin/env node

// 🚀 Bundle Analysis Script for Performance Optimization

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 🚀 Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, '../dist');
const ANALYSIS_FILE = path.join(__dirname, '../bundle-analysis.json');

// 🚀 Analyze bundle structure
function analyzeBundle() {
  console.log('🚀 Analyzing bundle structure...\n');
  
  const analysis = {
    timestamp: new Date().toISOString(),
    summary: {},
    chunks: {},
    assets: {},
    recommendations: []
  };

  try {
    // Read dist directory
    const files = fs.readdirSync(DIST_DIR);
    
    let totalSize = 0;
    let jsSize = 0;
    let cssSize = 0;
    let imageSize = 0;
    let otherSize = 0;
    
    const chunks = {};
    const assets = {
      js: [],
      css: [],
      images: [],
      other: []
    };

    files.forEach(file => {
      const filePath = path.join(DIST_DIR, file);
      const stats = fs.statSync(filePath);
      const size = stats.size;
      totalSize += size;

      if (file.endsWith('.js')) {
        jsSize += size;
        assets.js.push({ name: file, size, sizeKB: (size / 1024).toFixed(2) });
        
        // Analyze chunks
        if (file.includes('-')) {
          const chunkName = file.split('-')[0];
          if (!chunks[chunkName]) {
            chunks[chunkName] = { size: 0, files: [] };
          }
          chunks[chunkName].size += size;
          chunks[chunkName].files.push(file);
        }
      } else if (file.endsWith('.css')) {
        cssSize += size;
        assets.css.push({ name: file, size, sizeKB: (size / 1024).toFixed(2) });
      } else if (file.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)) {
        imageSize += size;
        assets.images.push({ name: file, size, sizeKB: (size / 1024).toFixed(2) });
      } else {
        otherSize += size;
        assets.other.push({ name: file, size, sizeKB: (size / 1024).toFixed(2) });
      }
    });

    // 🚀 Summary
    analysis.summary = {
      totalSize: (totalSize / 1024 / 1024).toFixed(2) + ' MB',
      jsSize: (jsSize / 1024 / 1024).toFixed(2) + ' MB',
      cssSize: (cssSize / 1024 / 1024).toFixed(2) + ' MB',
      imageSize: (imageSize / 1024 / 1024).toFixed(2) + ' MB',
      otherSize: (otherSize / 1024 / 1024).toFixed(2) + ' MB',
      totalFiles: files.length
    };

    // 🚀 Chunk analysis
    analysis.chunks = Object.entries(chunks).reduce((acc, [name, data]) => {
      acc[name] = {
        size: (data.size / 1024).toFixed(2) + ' KB',
        sizeBytes: data.size,
        files: data.files,
        fileCount: data.files.length
      };
      return acc;
    }, {});

    // 🚀 Asset analysis
    analysis.assets = {
      js: assets.js.sort((a, b) => b.size - a.size),
      css: assets.css.sort((a, b) => b.size - a.size),
      images: assets.images.sort((a, b) => b.size - a.size),
      other: assets.other.sort((a, b) => b.size - a.size)
    };

    // 🚀 Generate recommendations
    analysis.recommendations = generateRecommendations(analysis);

    // 🚀 Save analysis
    fs.writeFileSync(ANALYSIS_FILE, JSON.stringify(analysis, null, 2));
    
    // 🚀 Print summary
    printSummary(analysis);
    
    console.log(`\n📊 Detailed analysis saved to: ${ANALYSIS_FILE}`);
    
  } catch (error) {
    console.error('❌ Error analyzing bundle:', error.message);
    process.exit(1);
  }
}

// 🚀 Generate optimization recommendations
function generateRecommendations(analysis) {
  const recommendations = [];
  
  // Check main chunk size
  const mainChunk = analysis.chunks['index'];
  if (mainChunk && mainChunk.sizeBytes > 500 * 1024) {
    recommendations.push({
      type: 'warning',
      message: `Main chunk (${mainChunk.size}) is larger than 500KB. Consider further code splitting.`,
      priority: 'high'
    });
  }
  
  // Check for large images
  const largeImages = analysis.assets.images.filter(img => img.size > 100 * 1024);
  if (largeImages.length > 0) {
    recommendations.push({
      type: 'info',
      message: `${largeImages.length} images are larger than 100KB. Consider optimization.`,
      priority: 'medium'
    });
  }
  
  // Check chunk distribution
  const chunkSizes = Object.values(analysis.chunks).map(chunk => chunk.sizeBytes);
  const avgChunkSize = chunkSizes.reduce((sum, size) => sum + size, 0) / chunkSizes.length;
  
  if (avgChunkSize > 100 * 1024) {
    recommendations.push({
      type: 'warning',
      message: `Average chunk size (${(avgChunkSize / 1024).toFixed(2)}KB) is high. Consider more granular splitting.`,
      priority: 'medium'
    });
  }
  
  // Check for vendor chunks
  const vendorChunks = Object.keys(analysis.chunks).filter(name => 
    name.includes('vendor') || name.includes('react') || name.includes('ui')
  );
  
  if (vendorChunks.length === 0) {
    recommendations.push({
      type: 'warning',
      message: 'No vendor chunks detected. Consider separating third-party libraries.',
      priority: 'high'
    });
  }
  
  return recommendations;
}

// 🚀 Print analysis summary
function printSummary(analysis) {
  console.log('📊 BUNDLE ANALYSIS SUMMARY');
  console.log('========================');
  console.log(`📅 Timestamp: ${analysis.timestamp}`);
  console.log(`📦 Total Size: ${analysis.summary.totalSize}`);
  console.log(`🔧 JavaScript: ${analysis.summary.jsSize}`);
  console.log(`🎨 CSS: ${analysis.summary.cssSize}`);
  console.log(`🖼️  Images: ${analysis.summary.imageSize}`);
  console.log(`📁 Total Files: ${analysis.summary.totalFiles}`);
  
  console.log('\n🚀 CHUNK ANALYSIS');
  console.log('=================');
  Object.entries(analysis.chunks)
    .sort(([,a], [,b]) => b.sizeBytes - a.sizeBytes)
    .forEach(([name, data]) => {
      console.log(`${name.padEnd(20)} ${data.size.padStart(10)} (${data.fileCount} files)`);
    });
  
  console.log('\n💡 RECOMMENDATIONS');
  console.log('==================');
  analysis.recommendations.forEach((rec, index) => {
    const icon = rec.type === 'warning' ? '⚠️' : 'ℹ️';
    const priority = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
    console.log(`${index + 1}. ${icon} ${priority} ${rec.message}`);
  });
}

// 🚀 Run analysis
analyzeBundle();
