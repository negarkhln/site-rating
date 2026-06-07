# App/views/graph_views.py

from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from django.http import HttpResponse
import matplotlib

matplotlib.use('Agg')
import matplotlib.pyplot as plt
import networkx as nx
from io import BytesIO
import base64


@staff_member_required
def generate_graph(request, graph_type):
    G = nx.DiGraph()

    if graph_type == 'binary_search':
        G.add_edge('Start: left=0,\nright=n-1', 'left <= right?')
        G.add_edge('left <= right?', 'Return -1\n(Not Found)', label='No')
        G.add_edge('left <= right?', 'mid = left +\n(right-left)//2', label='Yes')
        G.add_edge('mid = left +\n(right-left)//2', 'arr[mid] == target?')
        G.add_edge('arr[mid] == target?', 'Return mid', label='Yes')
        G.add_edge('arr[mid] == target?', 'arr[mid] < target?', label='No')
        G.add_edge('arr[mid] < target?', 'left = mid + 1', label='Yes')
        G.add_edge('arr[mid] < target?', 'right = mid - 1', label='No')
        G.add_edge('left = mid + 1', 'left <= right?')
        G.add_edge('right = mid - 1', 'left <= right?')
        title = 'Control Flow Graph - Binary Search'

    elif graph_type == 'quick_sort':
        G.add_edge('Start:\nquick_sort(arr)', 'len(arr) <= 1?')
        G.add_edge('len(arr) <= 1?', 'Return arr', label='Yes')
        G.add_edge('len(arr) <= 1?', 'pivot = arr\n[len(arr)//2]', label='No')
        G.add_edge('pivot = arr\n[len(arr)//2]', 'Split into\nleft,middle,right')
        G.add_edge('Split into\nleft,middle,right', 'left = quick_sort(left)')
        G.add_edge('left = quick_sort(left)', 'right = quick_sort(right)')
        G.add_edge('right = quick_sort(right)', 'Return left +\nmiddle + right')
        title = 'Control Flow Graph - Quick Sort'

    elif graph_type == 'merge_sort':
        G.add_edge('Start:\nmerge_sort(arr)', 'len(arr) <= 1?')
        G.add_edge('len(arr) <= 1?', 'Return arr', label='Yes')
        G.add_edge('len(arr) <= 1?', 'mid = len(arr)//2', label='No')
        G.add_edge('mid = len(arr)//2', 'left = merge_sort\n(arr[:mid])')
        G.add_edge('left = merge_sort\n(arr[:mid])', 'right = merge_sort\n(arr[mid:])')
        G.add_edge('right = merge_sort\n(arr[mid:])', 'Merge left\nand right')
        G.add_edge('Merge left\nand right', 'Return result')
        title = 'Control Flow Graph - Merge Sort'

    elif graph_type == 'is_old_user':
        G.add_edge('Start', 'join_days >= 10?')
        G.add_edge('join_days >= 10?', 'flag++', label='Yes')
        G.add_edge('join_days >= 10?', 'login_count >= 5?', label='No')
        G.add_edge('flag++', 'login_count >= 5?')
        G.add_edge('login_count >= 5?', 'flag++', label='Yes')
        G.add_edge('login_count >= 5?', 'total_ratings > 0?', label='No')
        G.add_edge('flag++', 'total_ratings > 0?')
        G.add_edge('total_ratings > 0?', 'avg_score >= 3.5?', label='Yes')
        G.add_edge('total_ratings > 0?', 'flag >= 2?', label='No')
        G.add_edge('avg_score >= 3.5?', 'flag++', label='Yes')
        G.add_edge('avg_score >= 3.5?', 'flag >= 2?', label='No')
        G.add_edge('flag++', 'flag >= 2?')
        G.add_edge('flag >= 2?', 'Return True\n(Old User)', label='Yes')
        G.add_edge('flag >= 2?', 'Return False\n(New User)', label='No')
        title = 'Control Flow Graph - is_old_user'

    else:
        return HttpResponse('Invalid graph type', status=400)

    plt.figure(figsize=(10, 7))
    pos = nx.spring_layout(G, k=1.2, seed=42)

    node_colors = []
    for node in G.nodes():
        if 'Start' in node or 'Return' in node:
            node_colors.append('#2ecc71')
        elif '?' in node:
            node_colors.append('#3498db')
        else:
            node_colors.append('#e67e22')

    nx.draw(G, pos,
            with_labels=True,
            node_color=node_colors,
            node_size=3000,
            font_size=7,
            font_weight='bold',
            font_family='Arial',
            arrows=True,
            arrowstyle='->',
            arrowsize=10,
            edge_color='#333',
            width=1.2)

    edge_labels = {(u, v): d['label'] for u, v, d in G.edges(data=True) if 'label' in d}
    nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels, font_size=6)

    plt.title(title, fontsize=12, fontweight='bold', pad=10)
    plt.axis('off')

    buffer = BytesIO()
    plt.savefig(buffer, format='png', dpi=100, bbox_inches='tight')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.getvalue()).decode()
    plt.close()

    return HttpResponse(f'<img src="data:image/png;base64,{image_base64}" style="max-width:100%; border-radius:8px;">')


def simple_graph_page(request, graph_type):
    titles = {
        'binary_search': 'Binary Search - Control Flow Graph',
        'quick_sort': 'Quick Sort - Control Flow Graph',
        'merge_sort': 'Merge Sort - Control Flow Graph',
        'is_old_user': 'is_old_user - Control Flow Graph',
    }
    return render(request, 'simple_graph.html', {
        'title': titles.get(graph_type, 'Control Flow Graph'),
        'graph_url': f'/generate-graph/{graph_type}/'
    })
