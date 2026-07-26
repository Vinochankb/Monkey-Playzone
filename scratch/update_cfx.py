import os

dir_path = '.'
for filename in os.listdir(dir_path):
    if filename.endswith('.html') or filename.endswith('.js'):
        filepath = os.path.join(dir_path, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        if 'mpz1' in content:
            content = content.replace('mpz1', 'xllrkdx')
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

print("Replaced mpz1 with xllrkdx")
