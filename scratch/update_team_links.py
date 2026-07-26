import os

dir_path = '.'
for filename in os.listdir(dir_path):
    if filename.endswith('.html'):
        filepath = os.path.join(dir_path, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Update hrefs to point to team.html
        updated_content = content.replace('href="#team"', 'href="team.html"')
        updated_content = updated_content.replace('href="index.html#team"', 'href="team.html"')

        if updated_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(updated_content)

print("Updated team links across all files")
