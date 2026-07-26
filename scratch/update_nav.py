import os
import re

dir_path = '.'
for filename in os.listdir(dir_path):
    if not filename.endswith('.html'):
        continue
    filepath = os.path.join(dir_path, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update rules links
    content = content.replace('href="index.html#rules"', 'href="rules.html"')
    content = content.replace('href="#rules"', 'href="rules.html"')

    # 2. Add Arena link in top-nav-links (with div separator)
    pattern_nav_sep = re.compile(r'(<a [^>]*href="rules\.html"[^>]*>Rules</a>\s*<div class="nav-sep"></div>)')
    if pattern_nav_sep.search(content):
        content = pattern_nav_sep.sub(r'\g<1>\n      <a href="arena.html" class="nav-link">Arena</a>\n      <div class="nav-sep"></div>', content)
    
    # 3. Add Arena link in inline styled top-nav (like in rules.html)
    # Be careful with matching the separator exactly. In rules.html it's:
    # <div style="width:1px; height:14px; background:rgba(212,161,76,0.3);"></div>
    pattern_inline_sep = re.compile(r'(<a [^>]*href="rules\.html"[^>]*>Rules</a>\s*<div style="width:1px; height:14px; background:rgba\(212,161,76,0\.3\);"></div>)')
    if pattern_inline_sep.search(content):
        inline_style = "font-family:'Bebas Neue', sans-serif; font-size:1.15rem; letter-spacing:0.16em; text-transform:uppercase; color:rgba(242,230,217,0.8); text-decoration:none; padding:6px 14px;"
        content = pattern_inline_sep.sub(r'\g<1>\n      <a href="arena.html" class="nav-link" style="' + inline_style + r'">Arena</a>\n      <div style="width:1px; height:14px; background:rgba(212,161,76,0.3);"></div>', content)

    # 4. Add Arena link in list items <li>...Rules...</li>
    # This matches <li><a href="rules.html">Rules</a></li> or similar with classes
    pattern_li = re.compile(r'(<li><a href="rules\.html"[^>]*>Rules</a></li>)')
    if pattern_li.search(content):
        def repl(m):
            orig = m.group(1)
            if 'class="nav-link"' in orig:
                return orig + '\n        <li><a href="arena.html" class="nav-link">Arena</a></li>'
            else:
                return orig + '\n        <li><a href="arena.html">Arena</a></li>'
        content = pattern_li.sub(repl, content)

    # 5. Some list items might have spacing inside li
    pattern_li_space = re.compile(r'(<li>\s*<a href="rules\.html"[^>]*>Rules</a>\s*</li>)')
    if pattern_li_space.search(content) and not pattern_li.search(content):
        def repl2(m):
            orig = m.group(1)
            if 'class="nav-link"' in orig:
                return orig + '\n        <li><a href="arena.html" class="nav-link">Arena</a></li>'
            else:
                return orig + '\n        <li><a href="arena.html">Arena</a></li>'
        content = pattern_li_space.sub(repl2, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done updating navigation links")
