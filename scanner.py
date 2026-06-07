import os
import json
import urllib.parse
from collections import defaultdict

def scan_claude():
    repos = defaultdict(lambda: {'name': '', 'path': '', 'count': 0})
    base_dir = os.path.expanduser('~/.claude/projects/')
    if not os.path.exists(base_dir):
        return repos
    
    for project_dir in os.listdir(base_dir):
        project_path = os.path.join(base_dir, project_dir)
        if not os.path.isdir(project_path):
            continue
        
        jsonl_files = [f for f in os.listdir(project_path) if f.endswith('.jsonl')]
        if not jsonl_files:
            continue
            
        # Read the first one to get the cwd
        try:
            with open(os.path.join(project_path, jsonl_files[0]), 'r') as f:
                for line in f:
                    try:
                        data = json.loads(line)
                        if 'cwd' in data:
                            cwd = data['cwd']
                            name = os.path.basename(cwd)
                            repos[cwd]['name'] = name
                            repos[cwd]['path'] = cwd
                            repos[cwd]['count'] += len(jsonl_files)
                            break
                    except:
                        continue
        except:
            continue
    return repos

def scan_cursor():
    repos = defaultdict(lambda: {'name': '', 'path': '', 'count': 0})
    base_dir = os.path.expanduser('~/Library/Application Support/Cursor/User/workspaceStorage/')
    if not os.path.exists(base_dir):
        return repos
    
    for ws_dir in os.listdir(base_dir):
        ws_path = os.path.join(base_dir, ws_dir)
        json_path = os.path.join(ws_path, 'workspace.json')
        if not os.path.exists(json_path):
            continue
            
        try:
            with open(json_path, 'r') as f:
                data = json.load(f)
                folder_uri = data.get('folder')
                if folder_uri and folder_uri.startswith('file://'):
                    path = urllib.parse.unquote(folder_uri[7:])
                    name = os.path.basename(path)
                    repos[path]['name'] = name
                    repos[path]['path'] = path
                    repos[path]['count'] += 1
        except:
            continue
    return repos

def scan_codex():
    repos = defaultdict(lambda: {'name': '', 'path': '', 'count': 0})
    base_dir = os.path.expanduser('~/.codex/sessions/')
    if not os.path.exists(base_dir):
        return repos
    
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.jsonl'):
                try:
                    with open(os.path.join(root, file), 'r') as f:
                        line = f.readline()
                        if line:
                            data = json.loads(line)
                            # Check payload.cwd or just cwd
                            cwd = data.get('payload', {}).get('cwd') or data.get('cwd')
                            if cwd:
                                name = os.path.basename(cwd)
                                repos[cwd]['name'] = name
                                repos[cwd]['path'] = cwd
                                repos[cwd]['count'] += 1
                except:
                    continue
    return repos

all_repos = defaultdict(lambda: {'name': '', 'path': '', 'count': 0})

for scanner in [scan_claude, scan_cursor, scan_codex]:
    found = scanner()
    for path, info in found.items():
        if not all_repos[path]['name']:
            all_repos[path]['name'] = info['name']
        all_repos[path]['path'] = info['path']
        all_repos[path]['count'] += info['count']

# Output results in a format we can parse or just print them
results = sorted(all_repos.values(), key=lambda x: x['count'], reverse=True)
print(json.dumps(results))
