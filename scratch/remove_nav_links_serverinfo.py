import os
import re

dir_path = '.'
for filename in os.listdir(dir_path):
    if not filename.endswith('.html'):
        continue
    filepath = os.path.join(dir_path, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    targets = ['server-info.html', '#server-info']

    for target in targets:
        escaped_target = re.escape(target)
        
        # 1. Remove <li> elements containing the target link (mobile/footer menus)
        pattern_li = re.compile(r'^\s*<li>\s*<a href="[^"]*?' + escaped_target + r'[^"]*".*?</a>\s*</li>\n?', re.MULTILINE | re.DOTALL)
        content = pattern_li.sub('', content)

        # 2. Remove <a> element and following separator div (top-nav-links)
        pattern_a_div = re.compile(r'\s*<a href="[^"]*?' + escaped_target + r'[^"]*"[^>]*>.*?</a>\s*<div[^>]*></div>', re.DOTALL)
        content = pattern_a_div.sub('', content)

        # 3. Fallback: just remove standalone <a> if the separator wasn't matched
        pattern_a = re.compile(r'\s*<a href="[^"]*?' + escaped_target + r'[^"]*"[^>]*>.*?</a>', re.DOTALL)
        content = pattern_a.sub('', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done removing server-info nav links")
