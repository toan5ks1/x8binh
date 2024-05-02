export const highlightSyntax = (jsonString: string) => {
  let escapedHtml = jsonString.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  escapedHtml = escapedHtml.replaceAll(' ', '');
  escapedHtml = escapedHtml.replace(
    /("[^"\\]*(?:\\.[^"\\]*)*")/g,
    `<span class='string-terminal'>$1</span>`
  );
  escapedHtml = escapedHtml.replace(/"/g, '&quot;');
  escapedHtml = escapedHtml.replaceAll('[', '<span class="bracket">[</span>');
  escapedHtml = escapedHtml.replaceAll(']', '<span class="bracket">]</span>');
  escapedHtml = escapedHtml.replaceAll(
    ',',
    '<span class="comma-terminal">,</span>'
  );
  escapedHtml = escapedHtml.replaceAll(
    '{',
    '<span class="angle-brackets">{</span>'
  );
  escapedHtml = escapedHtml.replaceAll(
    '}',
    '<span class="angle-brackets">}</span>'
  );
  escapedHtml = escapedHtml.replace(
    /\b\d+\b/g,
    '<span class="number">$&</span>'
  );
  return escapedHtml;
};
