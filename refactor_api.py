import os
import re

src_dir = '/home/uday-b/Downloads/SleepSenseAI/sleepsense-ui/src'
pattern1 = re.compile(r"fetch\('(/api/[^']*)'")
pattern2 = re.compile(r"fetch\(`(/api/[^`]*)`")

api_base_decl = "const API_BASE = import.meta.env.VITE_BACKEND_URL;"

for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.js') or file.endswith('.jsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            
            if "fetch('/api/" in content or 'fetch(`/api/' in content:
                new_content = pattern1.sub(r"fetch(`${API_BASE}\1`", content)
                new_content = pattern2.sub(r"fetch(`${API_BASE}\1`", new_content)
                
                if new_content != content and "const API_BASE" not in new_content:
                    lines = new_content.split('\n')
                    last_import_idx = -1
                    for i, line in enumerate(lines):
                        if line.startswith('import '):
                            last_import_idx = i
                    
                    lines.insert(last_import_idx + 1, "\n" + api_base_decl)
                    new_content = '\n'.join(lines)
                    
                    with open(filepath, 'w') as f:
                        f.write(new_content)
                    print(f"Updated {filepath}")
