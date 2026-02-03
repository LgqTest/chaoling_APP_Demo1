/**
 * 简单的 Markdown 转 HTML 工具
 * 支持标题、粗体、斜体、代码等基本语法
 */

export const markdownToHtml = (markdown) => {
	if (!markdown || typeof markdown !== 'string') {
		return '';
	}

	let html = markdown;

	// 【重要】先处理标题（在转义HTML之前，因为#会被转义）
	// 标题 # h1
	html = html.replace(/^# (.+)$/gm, '<h1 style="font-size:1.5em;font-weight:bold;margin:10px 0;color:#000;">$1</h1>');

	// 标题 ## h2
	html = html.replace(/^## (.+)$/gm, '<h2 style="font-size:1.3em;font-weight:bold;margin:10px 0;color:#000;">$1</h2>');

	// 标题 ### h3
	html = html.replace(/^### (.+)$/gm, '<h3 style="font-size:1.1em;font-weight:bold;margin:10px 0;color:#000;">$1</h3>');

	// 引用 > text（也要在转义前处理）
	html = html.replace(/^> (.+)$/gm, '<blockquote style="border-left:4px solid #ddd;padding-left:10px;margin:10px 0;color:#666;">$1</blockquote>');

	// 转义 HTML 特殊字符（防止 XSS）
	html = html.replace(/&/g, '&amp;');
	html = html.replace(/</g, '&lt;');
	html = html.replace(/>/g, '&gt;');

	// 代码块 ```code```
	html = html.replace(/```(\w*)([\s\S]*?)```/g, (match, lang, code) => {
		return `<pre style="background:#f4f4f4;padding:10px;border-radius:5px;overflow-x:auto;"><code>${code.trim()}</code></pre>`;
	});

	// 行内代码 `code`
	html = html.replace(/`([^`]+)`/g, '<code style="background:#f4f4f4;padding:2px 5px;border-radius:3px;">$1</code>');

	// 粗体 **text**
	html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
	html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

	// 斜体 *text*
	html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
	html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

	// 删除线 ~~text~~
	html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');

	// 链接 [text](url)
	html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#007aff;">$1</a>');

	// 图片 ![alt](url)
	html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;"/>');

	// 换行处理：将两个换行符转换为段落标签
	html = html.replace(/\n\n/g, '</p><p style="margin:10px 0;">');
	html = '<p style="margin:10px 0;">' + html + '</p>';

	// 清理多余的 p 标签包裹
	html = html.replace(/<p style="margin:10px 0;"><h([1-6])[^>]*>/g, '<h$1>');
	html = html.replace(/<\/h([1-6])><\/p>/g, '</h$1>');
	html = html.replace(/<p style="margin:10px 0;"><pre>/g, '<pre>');
	html = html.replace(/<\/pre><\/p>/g, '</pre>');
	html = html.replace(/<p style="margin:10px 0;"><blockquote/g, '<blockquote');
	html = html.replace(/<\/blockquote><\/p>/g, '</blockquote>');

	return html;
};
