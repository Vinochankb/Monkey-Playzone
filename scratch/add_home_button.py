import os
import re

dir_path = '.'
for filename in os.listdir(dir_path):
    if not filename.endswith('.html'):
        continue
    filepath = os.path.join(dir_path, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if Home already exists in top-nav-links
    if re.search(r'<a href="index.html[^"]*" class="nav-link(?: active)?">Home</a>', content):
        continue

    # We want to insert the Home link right after <nav class="top-nav-links"...>
    
    # In index.html, it's just <nav class="top-nav-links">
    # In arena.html, it's <nav class="top-nav-links" style="...">
    # So we match <nav class="top-nav-links"[^>]*>
    
    # For index.html, let's make it active? No, we can just let scrollspy handle it if we want, or just add it normally.
    # index.html scrollspy might not highlight "Home", but it's fine.
    
    replacement = r'\g<0>\n      <a href="index.html" class="nav-link">Home</a>\n      <div class="nav-sep"></div>'
    
    # Some files like arena.html have inline styles for the separator:
    # <div style="width:1px; height:14px; background:rgba(212,161,76,0.3);"></div>
    # Let's match whatever is the separator in that file and duplicate it if possible, or just use nav-sep.
    # The uniform styling script previously used inline styles, but index.html uses classes.
    # Actually, in arena.html, the separator is `<div style="width:1px; height:14px; background:rgba(212,161,76,0.3);"></div>`.
    # It's better to just use that.

    if "background:rgba(212,161,76,0.3)" in content:
        separator = '<div style="width:1px; height:14px; background:rgba(212,161,76,0.3);"></div>'
        nav_link_class = 'class="nav-link" style="font-family:\'Bebas Neue\', sans-serif; font-size:1.15rem; letter-spacing:0.16em; text-transform:uppercase; color:rgba(242,230,217,0.8); text-decoration:none; padding:6px 14px;"'
    else:
        separator = '<div class="nav-sep"></div>'
        nav_link_class = 'class="nav-link"'

    # Only insert if not already present
    if "Home</a>" not in content.split('<nav class="top-nav-links"')[1].split('</nav>')[0]:
        new_content = re.sub(
            r'(<nav class="top-nav-links"[^>]*>)',
            r'\1\n      <a href="index.html" ' + nav_link_class + r'>Home</a>\n      ' + separator,
            content,
            count=1
        )
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

print("Home button added to navigation menus")
