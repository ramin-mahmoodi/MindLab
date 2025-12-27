import json

# Fix MBI - scales don't match cutoffs
with open('apps/web/src/data/tests/mbi.json', 'r', encoding='utf-8') as f:
    mbi = json.load(f)

# Update scale keys to match cutoffs
mbi['scales'] = [
    {"key": "emotional_exhaustion", "name": "Emotional Exhaustion", "nameFa": "خستگی هیجانی"},
    {"key": "depersonalization", "name": "Depersonalization", "nameFa": "مسخ شخصیت"},
    {"key": "personal_accomplishment", "name": "Personal Accomplishment", "nameFa": "موفقیت فردی"}
]

# Update questions to use new scale keys
for q in mbi['questions']:
    if q.get('scaleKey') == 'exhaustion':
        q['scaleKey'] = 'emotional_exhaustion'
    elif q.get('scaleKey') == 'accomplishment':
        q['scaleKey'] = 'personal_accomplishment'

with open('apps/web/src/data/tests/mbi.json', 'w', encoding='utf-8') as f:
    json.dump(mbi, f, ensure_ascii=False, indent=4)
print("Fixed MBI")

# Fix ENRICH - add total scale
with open('apps/web/src/data/tests/enrich.json', 'r', encoding='utf-8') as f:
    enrich = json.load(f)

# Add total scale if not present
if not any(s['key'] == 'total' for s in enrich['scales']):
    enrich['scales'].append({"key": "total", "name": "Total", "nameFa": "نمره کل"})

with open('apps/web/src/data/tests/enrich.json', 'w', encoding='utf-8') as f:
    json.dump(enrich, f, ensure_ascii=False, indent=4)
print("Fixed ENRICH")

# Fix WHOQOL-BREF - check for total scale issue
with open('apps/web/src/data/tests/whoqol-bref.json', 'r', encoding='utf-8') as f:
    whoqol = json.load(f)

# Add total scale if cutoffs reference it
cutoff_keys = set([c['scaleKey'] for c in whoqol.get('cutoffs', [])])
scale_keys = set([s['key'] for s in whoqol['scales']])
missing = cutoff_keys - scale_keys

if 'total' in missing and not any(s['key'] == 'total' for s in whoqol['scales']):
    whoqol['scales'].append({"key": "total", "name": "Total", "nameFa": "نمره کل"})

with open('apps/web/src/data/tests/whoqol-bref.json', 'w', encoding='utf-8') as f:
    json.dump(whoqol, f, ensure_ascii=False, indent=4)
print("Fixed WHOQOL-BREF")

print("\nAll fixed!")
