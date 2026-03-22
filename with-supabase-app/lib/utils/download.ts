import JSZip from 'jszip';

/**
 * Download a single Markdown file
 */
export function downloadMarkdown(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download all documents as a ZIP file
 */
export async function downloadAllAsZip(
  projectTitle: string,
  documents: {
    userJourney: string;
    prd: string;
    frontend: string;
    backend: string;
    database: string;
  }
): Promise<void> {
  const zip = new JSZip();

  // Add all documents to the ZIP
  zip.file('01-用户旅程地图.md', documents.userJourney);
  zip.file('02-产品需求文档PRD.md', documents.prd);
  zip.file('03-前端设计文档.md', documents.frontend);
  zip.file('04-后端设计文档.md', documents.backend);
  zip.file('05-数据库设计文档.md', documents.database);

  // Generate ZIP file
  const content = await zip.generateAsync({ type: 'blob' });

  // Download the ZIP
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${projectTitle}-开发文档.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
