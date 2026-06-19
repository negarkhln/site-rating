import matplotlib.pyplot as plt
import networkx as nx


def draw_perfect_cfgs():
    # ==========================================================
    # GRAPH 1: MANUAL LINEAR SEARCH (FIXED)
    # ==========================================================
    G1 = nx.DiGraph()
    labels1 = {
        1: "1: Start & Get Inputs\n(movies, query)",
        2: "2: Initialize\nfiltered_list = []",
        3: "3: Loop For\neach movie in list",
        4: "4: Condition IF\n(query in name/director)",
        5: "5: Action\nappend to filtered_list",
        6: "6: Loop Return\nMove to next item",
        7: "7: End & Return\nfiltered_list"
    }
    G1.add_nodes_from(labels1.keys())
    # اضافه شدن ارتباط قطعی ۶ به ۳
    G1.add_edges_from([(1, 2), (2, 3), (3, 4), (4, 5), (4, 6), (5, 6), (6, 3), (3, 7)])

    # تغییر مختصات برای باز شدن فضا جهت نمایش خط برگشت ۶ به ۳
    pos1 = {
        1: (0, 4),
        2: (0, 3),
        3: (0, 2),
        4: (0, 1),
        5: (1.2, 0.5),
        6: (0, -0.5),
        7: (-1.8, 1.5)
    }
    colors1 = ['#ff7f7f', '#7fff7f', '#7f7fff', '#7f7fff', '#7fff7f', '#7fff7f', '#ff7f7f']

    plt.figure(figsize=(10, 8))
    plt.title("Control Flow Graph (CFG) - Manual Linear Search", fontsize=14, fontweight='bold', pad=20)
    nx.draw_networkx_nodes(G1, pos1, node_size=2500, node_color=colors1, edgecolors='black', linewidths=1.5)
    nx.draw_networkx_edges(G1, pos1, arrowstyle="->", arrowsize=20, width=2, edge_color='#444444')
    nx.draw_networkx_labels(G1, pos1, labels=labels1, font_size=9, font_weight='bold')
    plt.axis('off')
    plt.tight_layout()
    plt.savefig("1_linear_search_cfg.png", dpi=300)
    plt.close()

    # ==========================================================
    # GRAPH 2: MANUAL BUBBLE SORT (FIXED)
    # ==========================================================
    G2 = nx.DiGraph()
    labels2 = {
        1: "1: Start & Get List\n(array of movies)",
        2: "2: Get Length\nn = len(array)",
        3: "3: Outer Loop For i\nrange(0, n)",
        4: "4: Inner Loop For j\nrange(0, n-i-1)",
        5: "5: Condition IF\n(arr[j].name > arr[j+1].name)",
        6: "6: Action\nSwap elements",
        7: "7: Inner Loop Return\nMove to next j",
        8: "8: Outer Loop Return\nMove to next i",
        9: "9: End & Return\nsorted array"
    }
    G2.add_nodes_from(labels2.keys())
    # اصلاح مسیر بازگشت: ۸ به ۳ متصل می‌شود (حلقه بیرونی) و ۷ به ۴ (حلقه داخلی)
    G2.add_edges_from([
        (1, 2), (2, 3), (3, 4), (4, 5), (5, 6),
        (5, 7), (6, 7), (7, 4), (4, 8), (8, 3), (3, 9)
    ])

    pos2 = {
        1: (0, 5),
        2: (0, 4),
        3: (0, 3),
        4: (0, 1.8),
        5: (0, 0.5),
        6: (1.5, 0),
        7: (0, -0.8),
        8: (-1.5, 1),
        9: (-2, 3.5)
    }
    colors2 = ['#ff7f7f', '#7fff7f', '#7f7fff', '#7f7fff', '#7f7fff', '#7fff7f', '#7fff7f', '#7fff7f', '#ff7f7f']

    plt.figure(figsize=(11, 9))
    plt.title("Control Flow Graph (CFG) - Manual Bubble Sort", fontsize=14, fontweight='bold', pad=20)
    nx.draw_networkx_nodes(G2, pos2, node_size=2300, node_color=colors2, edgecolors='black', linewidths=1.5)
    nx.draw_networkx_edges(G2, pos2, arrowstyle="->", arrowsize=20, width=2, edge_color='#444444')
    nx.draw_networkx_labels(G2, pos2, labels=labels2, font_size=8.5, font_weight='bold')
    plt.axis('off')
    plt.tight_layout()
    plt.savefig("2_bubble_sort_cfg.png", dpi=300)
    plt.close()

    # ==========================================================
    # GRAPH 3: MANUAL SELECTION SORT (FIXED)
    # ==========================================================
    G3 = nx.DiGraph()
    labels3 = {
        1: "1: Start & Get List\n(array of movies)",
        2: "2: Get Length\nn = len(array)",
        3: "3: Outer Loop For i\nrange(0, n)",
        4: "4: Initialize Index\nmax_idx = i",
        5: "5: Inner Loop For j\nrange(i+1, n)",
        6: "6: Condition IF\n(arr[j].rating > arr[max_idx].rating)",
        7: "7: Action\nUpdate max_idx = j",
        8: "8: Inner Loop Return\nMove to next j",
        9: "9: Action After Inner\nSwap arr[i] & arr[max_idx]",
        10: "10: Outer Loop Return\nMove to next i",
        11: "11: End & Return\nsorted array"
    }
    G3.add_nodes_from(labels3.keys())
    # اصلاح اتصالات برای چرخه درست حلقه‌های داخلی و خارجی
    G3.add_edges_from([
        (1, 2), (2, 3), (3, 4), (4, 5), (5, 6), (6, 7),
        (6, 8), (7, 8), (8, 5), (5, 9), (9, 10), (10, 3), (3, 11)
    ])

    pos3 = {
        1: (0, 6),
        2: (0, 5),
        3: (0, 4),
        4: (0, 3),
        5: (0, 1.8),
        6: (0, 0.5),
        7: (1.5, 0),
        8: (0, -0.8),
        9: (-1.5, 1.2),
        10: (-1.5, 2.8),
        11: (-2.2, 4.5)
    }
    colors3 = ['#ff7f7f', '#7fff7f', '#7f7fff', '#7fff7f', '#7f7fff', '#7f7fff', '#7fff7f', '#7fff7f', '#7fff7f',
               '#7fff7f', '#ff7f7f']

    plt.figure(figsize=(12, 10))
    plt.title("Control Flow Graph (CFG) - Manual Selection Sort", fontsize=14, fontweight='bold', pad=20)
    nx.draw_networkx_nodes(G3, pos3, node_size=2100, node_color=colors3, edgecolors='black', linewidths=1.5)
    nx.draw_networkx_edges(G3, pos3, arrowstyle="->", arrowsize=20, width=2, edge_color='#444444')
    nx.draw_networkx_labels(G3, pos3, labels=labels3, font_size=8, font_weight='bold')
    plt.axis('off')
    plt.tight_layout()
    plt.savefig("3_selection_sort_cfg.png", dpi=300)
    plt.close()

    print("All 3 CFGs successfully generated with correct structural loop returns!")


if __name__ == "__main__":
    draw_perfect_cfgs()
