import os
import re

src_dir = '/home/uday-b/Downloads/SleepSenseAI/sleepsense-ui/src'
api_base_decl = "const API_BASE = import.meta.env.VITE_BACKEND_URL;"

for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.js') or file.endswith('.jsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            
            if api_base_decl in content:
                # Remove the bad declarations
                content = content.replace("\n" + api_base_decl, "")
                content = content.replace(api_base_decl, "")
                
                lines = content.split('\n')
                last_import_line_idx = -1
                in_import_block = False
                
                for i, line in enumerate(lines):
                    stripped = line.strip()
                    if stripped.startswith('import '):
                        in_import_block = True
                        last_import_line_idx = i
                    if in_import_block:
                        last_import_line_idx = i
                        # the import statement finishes when it has the module path string
                        if re.search(r"['\"];?$", stripped):
                            in_import_block = False
                
                if last_import_line_idx != -1:
                    lines.insert(last_import_line_idx + 1, "\n" + api_base_decl + "\n")
                else:
                    lines.insert(0, api_base_decl + "\n")
                
                new_content = '\n'.join(lines)
                # Clean up any excessive newlines created
                new_content = new_content.replace("\n\n\n", "\n\n")
                
                with open(filepath, 'w') as f:
                    f.write(new_content)
                print(f"Fixed {filepath}")
