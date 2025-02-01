from flask import Flask, render_template
from slugify import slugify
import json
import os

app = Flask(__name__)
app.jinja_env.filters['slugify'] = slugify

def load_arcs():
    with open('guide.json', 'r') as f:
        data = json.load(f)
    
    arcs = []
    for arc in data:
        if not arc['episodes']:
            continue
        
        arcs.append({
            'name': arc['name'],
            'category': arc['category'],
            'episode_details': [{
                'number': str(ep['number']),
                'link': ep['link'],
                'type': arc['category']
            } for ep in arc['episodes']],
            'slug': slugify(arc['name']),
            'total_episodes': len(arc['episodes']),
            'image': arc.get('image', '')
        })
    return arcs

@app.route('/')
def landing():
    return render_template('landing.html')

@app.route('/watch')
def watch():
    arcs = load_arcs()
    return render_template('index.html', arcs=arcs)

@app.route('/stats')
def stats():
    return render_template('stats.html', arcs=load_arcs())

@app.route('/arc/<string:arc_name>')
def arc_detail(arc_name):
    arc = next((a for a in load_arcs() if a['slug'] == arc_name), None)
    return render_template('arc_detail.html', arc=arc) if arc else redirect('/')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)